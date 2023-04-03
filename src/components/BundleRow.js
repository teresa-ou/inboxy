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

import BulkArchiveButton from './BulkArchiveButton';

import MessagePageUtils from '../util/MessagePageUtils';
import DomUtils from '../util/DomUtils';
import { 
    GmailClasses, 
    InboxyClasses,
    Selectors,
} from '../util/Constants';

const MAX_MESSAGE_COUNT = 25;

// TODO: Using colors sholuld default to false?
let useLabelColorsSetting = true;
chrome.storage.sync.get(['useLabelColors'], ({ useLabelColors = true }) => {
    useLabelColorsSetting = useLabelColors;
});

/**
 * Create a table row for a bundle, to be shown in the list of messages. 
 */
function create(label, order, messages, hasUnread, toggleBundle, baseUrl, textColor, backgroundColor, borderColor) {
    const displayedMessageCount = messages.length >= MAX_MESSAGE_COUNT 
        ? `${MAX_MESSAGE_COUNT}+` 
        : messages.length;
    const unreadClass = hasUnread ? GmailClasses.UNREAD : GmailClasses.READ;

    let spacerClass = '';
    if (document.querySelector(Selectors.IMPORTANCE_MARKER)) {
        spacerClass = GmailClasses.IMPORTANCE_MARKER;
    }
    else if (document.querySelector(Selectors.PERSONAL_LEVEL_INDICATOR)) {
        spacerClass = GmailClasses.PERSONAL_LEVEL_INDICATOR;
    }

    const sendersText = _generateSendersText(messages).join(', ');

    const snoozedText = messages[0].querySelector(Selectors.MESSAGE_SNOOZED_TEXT);
    const latestDate = snoozedText
        ? snoozedText.innerText
        : messages[0].querySelector(Selectors.MESSAGE_DATE_SPAN).innerText;

    const latestIsUnreadClass = messages[0].classList.contains(GmailClasses.UNREAD) ? 'unread' : '';
    const latestIsSnoozedClass = snoozedText ? GmailClasses.SNOOZED : '';

    const labelColorStyle = useLabelColorsSetting ? `style="color: ${textColor}; background-color: ${backgroundColor}; border-color: ${borderColor};"` : '';
    
    const html = `
        <tr class="${GmailClasses.ROW} ${InboxyClasses.BUNDLE_ROW} ${unreadClass}">
            <td class="${GmailClasses.CELL} PF"></td>
            <td class="${GmailClasses.CELL} oZ-x3"></td>
            <td class="${GmailClasses.CELL} apU"></td>
            <td class="spacer ${GmailClasses.CELL} ${spacerClass}"></td>
            <td class="${GmailClasses.CELL} yX">
                <div class="bundle-and-count">
                    <span ${labelColorStyle}>${label}</span>
                    <span class="bundle-count">(${displayedMessageCount})</span>
                </div>
            </td>
            <td class="${GmailClasses.CELL} ${GmailClasses.SUBJECT_CELL}">
                <span class="bundle-senders">
                    ${sendersText}
                </span>
            </td>
            <td class="${GmailClasses.CELL} flex-grow"></td>
        </tr>
    `;

    const bulkArchiveButton = BulkArchiveButton.create(messages);
    const bulkArchiveTd = DomUtils.htmlToElement(`<td class="${GmailClasses.CELL}"></td>`);
    bulkArchiveTd.appendChild(bulkArchiveButton);

    const labelUrl = label
        .split(' ').join('-')
        .split('/').join('%2F')
        .split('&').join('-');
    const url = `${baseUrl}#search/label%3AInbox+label%3A${labelUrl}`;
    const viewAllButtonHtml = `
        <td class="${GmailClasses.CELL}">
            <a 
                href="${url}" 
                class="view-all-link"
            >
                <div class="view-all">
                    View all
                </div>
            </a>
        </td>
    `;

    const bundleDateHtml = `
        <td class="bundle-date-cell ${snoozedText ? '' : GmailClasses.DATE_CELL} ${GmailClasses.CELL}">
            <span class="bundle-date ${latestIsUnreadClass} ${latestIsSnoozedClass}">
                ${latestDate}
            </span>
        </td>
    `;

    const el = DomUtils.htmlToElement(html);
    el.appendChild(bulkArchiveTd);
    el.appendChild(DomUtils.htmlToElement(bundleDateHtml));
    el.appendChild(DomUtils.htmlToElement(viewAllButtonHtml));

    el.addEventListener('click', e => {
        if (!e.target.matches(`.${InboxyClasses.VIEW_ALL_LINK}`) && 
            !e.target.matches('.view-all')) 
        {
            toggleBundle(label);
        }
        
        // Don't propagate to handler for click-outside to close bundle
        e.stopPropagation();
    });
    el.style.order = order;

    return el;
}

function _generateSendersText(messages) {
    const dedupedSenders = [];
    const unreadStatusBySenders = {};

    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const sendersElements = [...message.querySelectorAll(Selectors.SENDERS)];;
        
        for (let j = sendersElements.length - 1; j >= 0; j--) {
            const sender = sendersElements[j].innerText;
            if (!unreadStatusBySenders.hasOwnProperty(sender)) {
                dedupedSenders.push(sender);
            }
            const isUnread = sendersElements[j].classList.contains(GmailClasses.UNREAD_SENDER);
            unreadStatusBySenders[sender] = !!unreadStatusBySenders[sender] || isUnread;
        }
    }

    return dedupedSenders.map(s => 
        unreadStatusBySenders[s] ? `<span class="unread-sender">${s}</span>` : s)
}

export default { create };
