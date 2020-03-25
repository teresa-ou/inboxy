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

/**
 * Create a table row for a bundle, to be shown in the list of messages. 
 */
function create(label, order, messageCount, hasUnread, toggleBundle) {
    const displayedMessageCount = messageCount >= MAX_MESSAGE_COUNT 
        ? `${MAX_MESSAGE_COUNT}+` 
        : messageCount;
    const unreadClass = hasUnread ? GmailClasses.UNREAD : '';

    const html = `
        <tr class="${GmailClasses.ROW} ${GmailClasses.READ} ${InboxyClasses.BUNDLE_ROW} ${unreadClass}">
            <td class="${GmailClasses.CELL} PF"></td>
            <td class="${GmailClasses.CELL} oZ-x3"></td>
            <td class="${GmailClasses.CELL} apU"></td>
            <td class="${GmailClasses.CELL}"></td>
            <td class="${GmailClasses.CELL} yX">
                <span>${label}</span>
                <span class="bundle-count">&nbsp;(${displayedMessageCount})</span>
            </td>
            <td class="${GmailClasses.CELL} flex-grow" colspan="3"></td>
        </tr>
    `;

    const bulkArchiveButton = BulkArchiveButton.create(order);
    const bulkArchiveTd = DomUtils.htmlToElement(`<td class="${GmailClasses.CELL}"></td>`);
    bulkArchiveTd.appendChild(bulkArchiveButton);

    const labelUrl = label.replace(' ', '+').replace('/', '%2F');
    const viewAllButtonHtml = `
        <td class="${GmailClasses.CELL}">
            <a 
                href="https://mail.google.com/mail/u/0/#label/${labelUrl}" 
                class="view-all-link"
            >
                <div class="view-all">
                    View all
                </div>
            </a>
        </td>
    `;

    const el = DomUtils.htmlToElement(html);
    el.appendChild(bulkArchiveTd);
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

export default { create };