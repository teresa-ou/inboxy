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
import DomUtils from '../util/DomUtils';
import { supportsBundling } from '../util/MessagePageUtils';

const _getTop = function(element) {
    return element.getBoundingClientRect().top;
};

/**
 * Handler for when messages are starred or unstarred.
 */
class StarHandler {
    constructor(bundledMail, selectiveBundling) {
        this.bundledMail = bundledMail;
        this.selectiveBundling = selectiveBundling;
        this.prevTop = null;

        this.handleStarring = this.handleStarring.bind(this);
    }

    /**
     * Handle starring or unstarring.
     */
    handleStarring(e) {
        if (!supportsBundling(window.location.href)) {
            return;
        }

        const isStarring = e.target.matches(Selectors.UNSTARRED);
        const isUnstarring = e.target.matches(Selectors.STARRED);

        if (!isStarring && !isUnstarring) {
            return;
        }

        // Only applies to bundled messages
        const messageRow = DomUtils.findMessageRow(e.target);
        const labels = this.selectiveBundling.filterStrings(DomUtils.getLabels(messageRow));
        if (!labels.length) {
            return;
        }

        // Record the scroll position
        let elementTop;
        // Message top
        if (isUnstarring) {
            this.bundledMail.openBundle(labels[0]);
            elementTop = _getTop(messageRow);
        } 
        // Bundle row top
        else if (isStarring) {
            const label = this.bundledMail.getLabelOfOpenedBundle();
            const bundleRow = this.bundledMail.getBundle(label).getBundleRow();
            elementTop = _getTop(bundleRow);
        }

        const scrollableContainer = document.querySelector(Selectors.SCROLLABLE_CONTAINER);
        this.prevTop = scrollableContainer.scrollTop + _getTop(scrollableContainer) - elementTop;
    }

    /**
     * When the list of messages updates after starring/unstarring a message, adjust the scroll
     * position so that the message position on the screen is close to where it previously was.
     * 
     * The same message can't be easily retrieved after rebundling, so for unstarring, scroll to
     * match bundle row with where the message was, and for starring, scroll to match bundle row
     * where the bundle row was.
     */
    scrollIfNecessary() {
        const label = this.bundledMail.getLabelOfOpenedBundle();
        if (!this.prevTop || !label) {
            return;
        }

        const bundleRow = this.bundledMail.getBundle(label).getBundleRow();

        const elementTop = _getTop(bundleRow);
        const scrollableContainer = document.querySelector(Selectors.SCROLLABLE_CONTAINER);
        scrollableContainer.scrollTop = this.prevTop + elementTop - _getTop(scrollableContainer);

        this.prevTop = null;
    }
}

export default StarHandler;
