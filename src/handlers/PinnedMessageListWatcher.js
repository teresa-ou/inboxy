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

import { Selectors } from '../util/Constants';

const OBSERVER_CONFIG = { attributes: false, childList: true, subtree: true };

/**
 * Observer for the pinned message list.
 *
 * Watches for added/removed rows in the table body.
 */
class PinnedMessageListWatcher {
    constructor(callback) {
        this.observer = new MutationObserver(callback);
    }

    observe() {
        const possibleMessageLists = document.querySelectorAll(Selectors.POSSIBLE_MESSAGE_LISTS);
        const messageListContainer = possibleMessageLists.length 
            ? possibleMessageLists.item(1) 
            : null;
            
        if (messageListContainer) {
            const tbody = messageListContainer.querySelector('tbody');
            if (tbody) {
                this.observer.observe(tbody, OBSERVER_CONFIG);
            }
        }
    }

    disconnect() {
        this.observer.disconnect();
    }
}

export default PinnedMessageListWatcher;