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

import DomUtils from '../util/DomUtils';
import {
    GmailClasses,
    InboxyClasses,
    Selectors,
} from '../util/Constants';

/**
 * Create bulk archive button for archiving the given messages, which should be in the same bundle.
 */
function create(messages) {
    return _create(() => _selectUnstarredMessages(messages));
}

function _create(selectMessagesFunction) {
    const html = `
        <span class="archive-bundle ${GmailClasses.ARCHIVE_BUTTON}">
        </span>
    `;

    const archiveSpan = DomUtils.htmlToElement(html);
    archiveSpan.addEventListener('click', e =>  {
        if (archiveSpan.classList.contains('disabled')) {
            e.stopPropagation();
            return;
        }

        _archiveMessages(selectMessagesFunction);
        e.stopPropagation();
    });

    return archiveSpan;
}

function _archiveMessages(selectMessagesFunction) {
    const toolbarArchiveButton = document.querySelector(Selectors.TOOLBAR_ARCHIVE_BUTTON);

    const buttonIsVisible = new Promise((resolve, reject) => {
        const observer = new MutationObserver((mutation, observer) => {
            if (_isClickable(toolbarArchiveButton)) {
                observer.disconnect();
                resolve();
            }
        });
        observer.observe(
            toolbarArchiveButton.parentNode, 
            { attributes: true, childList: false, subtree: true });
    });

    const selectMessages = new Promise((resolve, reject) => {
        selectMessagesFunction();
        resolve();
    });

    Promise.all([buttonIsVisible, selectMessages]).then(() => _simulateClick(toolbarArchiveButton));
}

/**
 * Select only messages without any stars assigned to them.
 */
function _selectUnstarredMessages(messages) {
    for (let i = messages.length - 1; i >= 0; i--) {
        const checkboxNode = messages[i].querySelector(Selectors.MESSAGE_CHECKBOX);
        const starred = _isStarred(messages[i]);
        const checked = DomUtils.isChecked(checkboxNode);
        if (starred && checked || !starred && !checked) {
            checkboxNode.click();
        }
    }
}

function _isStarred(message) {
    return !message.querySelector(Selectors.UNSTARRED);
}

function _isClickable(button) {
    return getComputedStyle(button.parentNode).display !== 'none' && 
        button.getAttribute('aria-disabled') !== 'true';
}

function _simulateClick(element) {
    const dispatchMouseEvent = function(target, name) {
        const e = new MouseEvent(name, {
            view: window,
            bubbles: true,
            cancelable: true,
          });
        target.dispatchEvent(e);
    };
    dispatchMouseEvent(element, 'mouseover');
    dispatchMouseEvent(element, 'mousedown');
    dispatchMouseEvent(element, 'click');
    dispatchMouseEvent(element, 'mouseup');
}

export default { create };