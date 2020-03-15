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
    Selectors,
    NO_TAB,
} from './Constants';

/**
 * Get the message page number of the given url.
 */
function getPageNumber(url) {
    const hash = _getHash(url);
    if (_matchesPage1(hash)) {
        return 1;
    }

    return parseInt(_matchesPageX(hash)[1]);
};

/**
 * Get the message page number of the current url.
 */
function getCurrentPageNumber() {
    return getPageNumber(window.location.href);
};

/**
 * Get the name of the current tab.
 */
function getCurrentTab() {
    const tab = document.querySelector(Selectors.CURRENT_TAB);
    return tab ? tab.getAttribute('aria-label') : NO_TAB; 
}

/**
 * Whether messages should be bundled on the page.
 */
function supportsBundling(url) {
    return !url.includes('#') ||
        _matchesPage1(_getHash(url)) || 
        _matchesPageX(_getHash(url));
}

function _getHash(url) {
    const hash = url.split('#')[1];
    // # might be followed by ?
    const index = hash.indexOf('?');

    return index > 0 ? hash.substring(0, index) : hash;
}

function _matchesPage1(hash) {
    return hash.match(/inbox$/);
}

function _matchesPageX(hash) {
    return hash.match(/inbox\/p(\d+)$/);
}

export {
    getCurrentPageNumber, 
    getPageNumber,
    getCurrentTab,
    supportsBundling,
};