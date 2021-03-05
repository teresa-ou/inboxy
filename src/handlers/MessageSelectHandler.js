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

import { 
    GmailClasses,
    InboxyClasses,
} from '../util/Constants';
import DomUtils from '../util/DomUtils';
import { supportsBundling } from '../util/MessagePageUtils';
import InboxyStyler from '../bundling/InboxyStyler';

const MESSAGE_LIST_CONFIG = { 
    attributes: true,
    childList: false,
    subtree: false,
    attributeOldValue: true,
};

/**
 * Observers to handle when messages' checkboxes are clicked.
 *
 * Reapplies inboxy styling when Gmail applies its original styles when a message is selected.
 */
class MessageSelectHandler {

    constructor(bundledMail, selectiveBundling) {
        this.bundledMail = bundledMail;
        this.selectiveBundling = selectiveBundling;
        this.messageObservers = [];
        this.inboxyStyler = new InboxyStyler(bundledMail);

        this._handleMessageChange = this._handleMessageChange.bind(this);
    }

    /**
     * Start observing the given messages.
     */
    startWatching(messageElements) {
        this.messageObservers = messageElements.map(el => {
            const observer = new MutationObserver(this._handleMessageChange);
            observer.observe(el, MESSAGE_LIST_CONFIG);
            return observer;
        });
    }

    /**
     * Stop watching all messages.
     */
    stopWatching() {
        this.messageObservers.forEach(o => o.disconnect());
        this.messageObservers = [];
    }

    _handleMessageChange(mutations) {
        if (!supportsBundling(window.location.href)) {
            return;
        }

        mutations.forEach(mutation => {
            if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') {
                return;
            }

            const message = mutation.target;

            // Re-add inboxy styling that get removed when gmail applies checked/unchecked styling
            if (mutation.oldValue.includes(InboxyClasses.BUNDLED_MESSAGE) &&
                !message.classList.contains(InboxyClasses.BUNDLED_MESSAGE)) 
            {
                // Bundled message
                message.classList.add(InboxyClasses.BUNDLED_MESSAGE);
                if (mutation.oldValue.includes(InboxyClasses.VISIBLE)) {
                    message.classList.add(InboxyClasses.VISIBLE);
                }
                if (mutation.oldValue.includes(InboxyClasses.LAST)) {
                    message.classList.add(InboxyClasses.LAST);
                }
            }
            
            if (mutation.oldValue.includes(GmailClasses.SELECTED) !== 
                message.classList.contains(GmailClasses.SELECTED)) 
            {
                this.inboxyStyler.markSelectedBundlesFor(
                    this.selectiveBundling.filterStrings(DomUtils.getLabels(message)));
                this.inboxyStyler.disableBulkArchiveIfNecessary();
            }
        });    
    }

    
}

export default MessageSelectHandler;
