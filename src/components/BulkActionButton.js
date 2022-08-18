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
function createArchive(messages) {
    return _create('archive', GmailClasses.ARCHIVE_BUTTON, Selectors.TOOLBAR_ARCHIVE_BUTTON, () => _selectMessages(messages));
}

/**
 * Create bulk delete button for deleting the given messages, which should be in the same bundle.
 */
function createDelete(messages) {
    return _create('delete', GmailClasses.DELETE_BUTTON, Selectors.TOOLBAR_DELETE_BUTTON, () => _selectMessages(messages));
}

/**
 * Create bulk select button for selecting the given messages, which should be in the same bundle.
 */
function createSelect(messages) {
    return _create('select', InboxyClasses.SELECT_BUTTON, null, () => _selectMessages(messages));
}


function _create(action, spanClass, selector, selectMessagesFunction) {
    const html = `
        <span class="bulk-action ${action} ${spanClass}">
        </span>
    `;

    const actionSpan = DomUtils.htmlToElement(html);
    actionSpan.addEventListener('click', e =>  {
        if (actionSpan.classList.contains('disabled')) {
            e.stopPropagation();
            return;
        }

        _processMessages(selector, selectMessagesFunction);
        e.stopPropagation();
    });

    return actionSpan;
}

function _processMessages(selector, selectMessagesFunction) {
    if (selector === null) {
        selectMessagesFunction();
        return;
    }

    const toolbarActionButton = document.querySelector(selector);

    const buttonIsVisible = new Promise((resolve, reject) => {
        const observer = new MutationObserver((mutation, observer) => {
            if (_isClickable(toolbarActionButton)) {
                observer.disconnect();
                resolve();
            }
        });
        observer.observe(
            toolbarActionButton.parentNode, 
            { attributes: true, childList: false, subtree: true });
    });

    const selectMessages = new Promise((resolve, reject) => {
        selectMessagesFunction();
        resolve();
    });

    Promise.all([buttonIsVisible, selectMessages]).then(() => _simulateClick(toolbarActionButton));
}

/**
 * Select all given messages.
 */
function _selectMessages(messages) {
    for (let i = messages.length - 1; i >= 0; i--) {
        const checkboxNode = messages[i].querySelector(Selectors.MESSAGE_CHECKBOX);
        if (!DomUtils.isChecked(checkboxNode)) {
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

export default { createArchive, createDelete, createSelect };