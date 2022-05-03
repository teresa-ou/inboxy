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

import DateDivider from '../components/DateDivider';

import PinnedMessageListWatcher from '../handlers/PinnedMessageListWatcher';

import { 
    InboxyClasses,
    Selectors, 
    TableBodySelectors,
    Element,
} from '../util/Constants';
import DomUtils from '../util/DomUtils';

/**
 * Adds date dividers to a message list. 
 *
 * Many parts of the implementation are similar to Bundler.js, with some slight differences.
 */
class DateGrouper {
    constructor() {
        this.refreshDateDividers = this.refreshDateDividers.bind(this);
        this.pinnedMessageListWatcher = new PinnedMessageListWatcher(this.refreshDateDividers);
        chrome.storage.sync.get(['groupMessagesByDate'], ({ groupMessagesByDate = true }) => {
            this.groupMessagesByDate = groupMessagesByDate;
        });
    }

    /** 
     * Insert date dividers onto the current displayed message list.
     */
    refreshDateDividers() {
        const possibleMessageLists = document.querySelectorAll(Selectors.POSSIBLE_MESSAGE_LISTS);
        const messageList = possibleMessageLists.length ? possibleMessageLists.item(1) : null;

        if (!messageList) {
            return;
        }

        this.pinnedMessageListWatcher.disconnect();

        this._refreshDateDividers(messageList);
        this._hideInboxLabels(messageList);
        
        this.pinnedMessageListWatcher.observe();
    }

    _refreshDateDividers(messageList) {
        const tableBody = messageList.querySelector(Selectors.TABLE_BODY);

        document.querySelector('html').classList.add(InboxyClasses.INBOXY);
        tableBody.classList.add('flex-table-body');

        // Remove all pre-existing date rows
        tableBody.querySelectorAll('.date-row').forEach(n => n.remove());

        const messageNodes = [...tableBody.querySelectorAll(TableBodySelectors.MESSAGE_NODES)];

        const sampleDate = messageNodes.length 
            ? DomUtils.extractDate(messageNodes[0])
            : '';

        let messageRows = messageNodes.map(m => ({
            element: m,
            type: Element.UNBUNDLED_MESSAGE,
        }));

        if (this.groupMessagesByDate) {
            messageRows = DateDivider.withDateDividers(messageRows, sampleDate);
        }
        
        this._drawRows(messageRows, tableBody);
    }

    /**
     * Add date dividers to the page, and set order numbers for date dividers and messages.
     */
    _drawRows(tableRows, tableBody) {
        tableRows.forEach((e, i) => {
            switch (e.type) {
                case Element.DATE_DIVIDER:
                    const messages = DateDivider.findMessagesForDivider(tableRows, i);
                    const dividerNode = DateDivider.create(e.element, i, messages);
                    tableBody.append(dividerNode)
                    break;
                case Element.UNBUNDLED_MESSAGE:
                    e.element.style.order = i;
                    break;
                default:
                    throw `Unhandled element type: ${e.type}`;
            }
        });
    }

    _hideInboxLabels(messageList) {
        messageList.querySelectorAll(Selectors.INBOX_LABEL)
            .forEach(l => l.parentNode.style.display = 'none');
    }
} 

export default DateGrouper;