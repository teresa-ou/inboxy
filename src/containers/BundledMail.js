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
    getCurrentPageNumber,
    getCurrentTab,
} from '../util/MessagePageUtils';

/**
 * The collection of bundled mail for the inbox.
 * 
 * Keeps track of bundles for each page/tab of messages, and the current open bundle.
 */
class BundledMail {
    constructor() { 
        // Bundles map, keyed by pageNumber, tab name, and label
        this._bundlesMap = {};
        this._openedBundleLabel = '';
    }

    /**
     * Get the bundle for the current page of messages.
     */
    getBundle(label) {
        return this.getBundleOnPage(label, getCurrentPageNumber());
    }

    /**
     * Get the bundle for the given page number and label.
     */
    getBundleOnPage(label, pageNumber) {
        return this._bundlesMap[pageNumber][getCurrentTab()][label];
    }

    /**
     * Returns a map of all bundles on the current page, by label.
     */
    getAllBundles() {
        return this._bundlesMap[getCurrentPageNumber()][getCurrentTab()];
    }

    /**
     * Returns the label corresponding to the currently open bundle.
     */
    getLabelOfOpenedBundle() {
        return this._openedBundleLabel;
    }

    /**
     * Record that the bundle with the given label, is currently open.
     */
    openBundle(label) {
        this._openedBundleLabel = label;
    }

    /**
     * Record that no bundles are open.
     */
    closeBundle() {
        this._openedBundleLabel = '';
    }

    /**
     * Associate bundlesByLabel with the given message page number.
     */
    setBundles(bundlesByLabel, pageNumber) {
        if (!this._bundlesMap[pageNumber]) {
            this._bundlesMap[pageNumber] = {};
        }

        this._bundlesMap[pageNumber][getCurrentTab()] = bundlesByLabel;
    }
}

export default BundledMail;