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

/**
 * Observe the message list to detect when Gmail modifies it.
 * 
 * Something is triggering a page relayout, leading to loosing the bundles. 
 * To workaround this, setup an observer of the message list to reapply the bundles
 * whenever they are modified
 */
class MessageListObserver {
    constructor(callback) {        
        this.observer = new MutationObserver(mutations => {
            const filteredMutations = mutations.filter(m => m.target.matches(Selectors.POSSIBLE_MESSAGE_LISTS));

            if (filteredMutations.length) {
                callback(filteredMutations);
            }
        });
    }

    observe(selector) {
        const main = document.querySelector(Selectors.MAIN);
        this.mainParent = main.parentNode;
        this.observer.observe(this.mainParent, { 
            attributes: false, 
            childList: true, 
            subtree: true,
        });
    }

    disconnect() {
        this.observer.disconnect();
    }
}

export default MessageListObserver;