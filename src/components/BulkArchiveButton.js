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
    ORDER_INCREMENT
} from '../util/Constants';

/**
 * Create bulk archive button, for archiving all messages in a bundle.
 */
function create(bundleOrder) {
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

            _archiveAllMessages(bundleOrder);
            e.stopPropagation();
        });

        return archiveSpan;
    }

function _archiveAllMessages(bundleOrder) {
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
        _selectMessages(bundleOrder);
        resolve();
    });

    Promise.all([buttonIsVisible, selectMessages]).then(() => _simulateClick(toolbarArchiveButton));
}

/**
 * Select all messages in the bundle with the given bundle order number.
 */
function _selectMessages(bundleOrder) {
    const checkboxes = document.querySelectorAll(Selectors.CHECKBOXES);

    const minOrder = bundleOrder;
    const maxOrder = minOrder + ORDER_INCREMENT;

    for (let i = checkboxes.length - 1; i >= 0; i--) {
        const checkboxNode = checkboxes.item(i);
        const message = DomUtils.findMessageRow(checkboxNode);
        const order = message.style.order;
        if (minOrder <= order && order < maxOrder && !DomUtils.isChecked(checkboxNode)) {
            checkboxNode.click();
        }
    }
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