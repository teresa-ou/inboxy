// inboxy: Chrome extension for Google Inbox-style bundles in Gmail.
// Copyright (C) 2020  Teresa Ou

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import Bundle from '../containers/Bundle';

import BundleRow from '../components/BundleRow';
import DateDivider from '../components/DateDivider';

import QuickSelectHandler from '../handlers/QuickSelectHandler';
import MessageSelectHandler from '../handlers/MessageSelectHandler';

import InboxyStyler from './InboxyStyler';

import { 
    getCurrentPageNumber, 
    getCurrentBaseUrl,
} from '../util/MessagePageUtils';
import { 
    GmailClasses,
    InboxyClasses,
    Selectors, 
    TableBodySelectors,
    ORDER_INCREMENT, 
    Element,
} from '../util/Constants';
import DomUtils from '../util/DomUtils';

/**
 * Groups messages into bundles, and renders those bundles.
 */
class Bundler {
    constructor(bundleToggler, bundledMail, messageListWatcher, selectiveBundling) {
        this.bundleToggler = bundleToggler;
        this.bundledMail = bundledMail;
        this.messageListWatcher = messageListWatcher;
        this.selectiveBundling = selectiveBundling;
        this.messageSelectHandler = new MessageSelectHandler(bundledMail, selectiveBundling);
        this.inboxyStyler = new InboxyStyler(bundledMail);
        this.quickSelectHandler = new QuickSelectHandler();
        chrome.storage.sync.get(['groupMessagesByDate'], ({ groupMessagesByDate = true }) => {
            this.groupMessagesByDate = groupMessagesByDate;
        });
    }

    /**
     * Bundle together the messages on the current page of messages, if they aren't already bundled,
     * optionally reopening the most recently open bundle.
     *
     * Returns an object with info for debug printing.
     */
    bundleMessages(reopenRecentBundle) {
        const bundledMail = this.bundledMail;
        const possibleMessageLists = document.querySelectorAll(Selectors.POSSIBLE_MESSAGE_LISTS);
        const messageList = possibleMessageLists.length 
            ? possibleMessageLists.item(possibleMessageLists.length - 1) 
            : null;

        if (!messageList) {
            return {
                foundMessageList: false,
            };
        }
        
        let debugInfo = { foundMessageList: true };

        this.messageListWatcher.disconnect();

        // Only redraw if message list isn't still bundled
        if (!messageList.children[0].classList.contains('is-bundled')) {
            debugInfo = this._bundleMessages(messageList);
            messageList.children[0].classList.add('is-bundled');
        }

        // Either reopen the bundle that was open, or close all bundles
        if (reopenRecentBundle && bundledMail.getBundle(bundledMail.getLabelOfOpenedBundle())) {
            this.bundleToggler.openBundle(bundledMail.getLabelOfOpenedBundle());
        }
        else {
            bundledMail.closeBundle();
        }

        this.messageListWatcher.observe();

        return debugInfo;
    }

    /**
     * Bundle messages in the given messageList dom node.
     *
     * Table rows are reordered by using flexbox and the order property, since Gmail's js seems 
     * to require the DOM nodes to remain in their original order. 
     *
     * Returns an object with info for debug printing.
     */
    _bundleMessages(messageList) {
        const tableBody = messageList.querySelector(Selectors.TABLE_BODY);

        document.querySelector('html').classList.add(InboxyClasses.INBOXY);
        tableBody.classList.add('flex-table-body');

        const messageNodes = [...tableBody.querySelectorAll(TableBodySelectors.MESSAGE_NODES)];

        const bundlesByLabel = this._groupByLabel(messageNodes);
        const sortedTableRows = this._calculateSortedTableRows(messageNodes, bundlesByLabel);
        
        const bundleRowsByLabel = this._drawTableRows(sortedTableRows, tableBody);
        this._drawBundleBox(tableBody);

        Object.entries(bundleRowsByLabel).forEach(([label, bundleRow]) => {
            const bundle = bundlesByLabel[label];
            bundle.setBundleRow(bundleRow);
            bundle.setOrder(parseInt(bundleRow.style.order));
        });

        this.bundledMail.setBundles(bundlesByLabel, getCurrentPageNumber());

        this._applyStyles(messageNodes);
        this._attachHandlers(messageNodes, messageList);

        return {
            numMessages: messageNodes.length,
            numBundles: Object.keys(bundlesByLabel).length,
        };
    }

    /**
     * Group messages by their labels.
     * Returns a map of labels to bundles.
     */
    _groupByLabel(messageNodes) {
        const bundlesByLabel = {};

        messageNodes.forEach(message => {
            const messageLabels = this.selectiveBundling.filter(DomUtils.getLabels(message));

            if (!this._isStarred(message)) {
                messageLabels.forEach(l => {
                    const t = l.title;
                    const leaf = l.querySelector(Selectors.LABEL_LEAF);
                    const labelStyle = Object.assign(
                        DomUtils.getCSS(l, "background", "background-color", "font-family", "border"),
                        DomUtils.getCSS(leaf, "border-radius", "color", "padding")
                    );

                    if (!bundlesByLabel[t]) {
                        bundlesByLabel[t] = new Bundle(t, labelStyle);
                    }

                    bundlesByLabel[t].addMessage(message);
                });
            }
        })

        return bundlesByLabel;
    }

    /**
     * Returns a list of elements that will be shown in the message list,
     * in the same order they will be displayed.
     * 
     * Each item is an object with 'element' and 'type' fields. They can be
     * a message row, date divider, or bundle row.
     */
    _calculateSortedTableRows(messageNodes, bundlesByLabel) {
        
        const rows = this._calculateMessageAndBundleRows(messageNodes, bundlesByLabel);

        if (!this.groupMessagesByDate) {
            return rows;
        }

        const sampleDate = messageNodes.length 
            ? DomUtils.extractDate(messageNodes[0])
            : '';

        return DateDivider.withDateDividers(rows, sampleDate, this._getLatestMessage);
    }

    _calculateMessageAndBundleRows(messageNodes, bundlesByLabel) {
        const rows = [];
        const labels = new Set();

        for (let i = 0; i < messageNodes.length; i++) {
            const message = messageNodes[i];
            const messageLabels = this.selectiveBundling.filter(DomUtils.getLabels(message));

            if (messageLabels.length === 0 || this._isStarred(message)) {
                rows.push({
                    element: message,
                    type: Element.UNBUNDLED_MESSAGE,
                });
                continue;
            }

            messageLabels.forEach(l => {
                l = l.title;
                if (!labels.has(l) && bundlesByLabel[l]) {
                    rows.push({
                        element: bundlesByLabel[l],
                        type: Element.BUNDLE,
                    });
                    labels.add(l);
                }
            });
        }

        return rows;
    }

    /**
     * Return the most recent message associated with the given table row.
     */
    _getLatestMessage(tableRow) {
        if (!tableRow) {
            return null;
        }

        switch (tableRow.type) {
            case Element.BUNDLE:
                const bundle = tableRow.element;
                return bundle.getMessages()[0];
            case Element.UNBUNDLED_MESSAGE:
                return tableRow.element;
            default:
                throw `Unhandled element type: ${e.type}`;
        }   
    }

    /** 
     * Draw/append the table rows to the tableBody, and set their visual order.
     * 
     * Returns a map of newly created bundle rows by label.
     */
    _drawTableRows(tableRows, tableBody) {
        const baseUrl = getCurrentBaseUrl();
        const bundleRowsByLabel = {};
        tableRows.forEach((e, i) => {
            const order = (i + 1) * ORDER_INCREMENT;
            switch (e.type) {
                case Element.DATE_DIVIDER:
                    const messages = DateDivider.findMessagesForDivider(tableRows, i);
                    this._drawDateDivider(e.element, order, messages, tableBody);
                    break;
                case Element.BUNDLE:
                    const bundle = e.element;
                    const bundleRow = this._drawBundleRow(bundle, order, tableBody, baseUrl);
                    bundleRowsByLabel[bundle.getLabel()] = bundleRow;
                    break;
                case Element.UNBUNDLED_MESSAGE:
                    e.element.style.order = order;
                    break;
                default:
                    throw `Unhandled element type: ${e.type}`;
            }
        });

        return bundleRowsByLabel;
    }

    _drawBundleBox(tableBody) {
        const bundleBox = DomUtils.htmlToElement('<div class="bundle-area"></div>'); 
        bundleBox.addEventListener(
            'click', 
            () => this.bundleToggler.closeAllBundles());
        tableBody.appendChild(bundleBox);
    }

    /**
     * Create a date divider element and append it to the tableBody.
     */
    _drawDateDivider(divider, order, messages, tableBody) {
        const dividerNode = DateDivider.create(divider, order, messages);
        tableBody.append(dividerNode);
    }

    /**
     * Create a bundle row element and append it to the tableBody.
     */
    _drawBundleRow(bundle, order, tableBody, baseUrl) {
        const messages = bundle.getMessages();
        const hasUnreadMessages = messages.some(this._isUnreadMessage);

        const bundleRow = BundleRow.create(
            bundle.getLabel(), 
            bundle.getStyle(),
            order, 
            messages,
            hasUnreadMessages, 
            this.bundleToggler.toggleBundle,
            baseUrl);
        tableBody.appendChild(bundleRow);

        messages.forEach(m => m.classList.add(InboxyClasses.BUNDLED_MESSAGE));

        return bundleRow;
    }

    _isUnreadMessage(message) {
        return message.classList.contains(GmailClasses.UNREAD);
    }

    _isStarred(message) {
        return message.querySelector(`.${GmailClasses.STARRED}`);
    }

    _applyStyles(messageNodes) {
        this.inboxyStyler.markSelectedBundles();
        this.inboxyStyler.disableBulkArchiveIfNecessary();
    }

    _attachHandlers(messageNodes, messageList) {
        // Ensure shift+click selection works
        document.querySelectorAll(Selectors.CHECKBOXES)
            .forEach(
                n => n.addEventListener('click', this.quickSelectHandler.handleCheckboxClick));

        // Close bundles when clicking outside of any open bundle
        messageList.addEventListener('click', e => {
            // #63 - e.target may have been removed before event propagates to messageList
            if (document.body.contains(e.target) && !e.target.closest('tr')) {
                this.bundleToggler.closeAllBundles();
            }
        });

        this.messageSelectHandler.startWatching(messageNodes);
    }
}

export default Bundler;
