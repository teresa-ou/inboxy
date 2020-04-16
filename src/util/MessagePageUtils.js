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
    Urls,
} from './Constants';

/**
 * Get the message page number of the given url.
 */
function getPageNumber(url) {
    const hash = _getHash(url);
    if (_matchesPage1(hash)) {
        return 1;
    }

    const matchesPageX = _matchesPageX(hash);
    if (matchesPageX) {
        return parseInt(matchesPageX[1]);
    }
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
    if (!url.includes('#')) {
        return true;
    }

    const hash = _getHash(url);
    return _matchesPage1(hash) || !!_matchesPageX(hash);
}

/**
 * Whether the given url is for showing all starred (pinned) messages that are
 * in the inbox.
 */
function isStarredPage(url) {
    return url.includes('#') &&
        (_matchesStarredPage1(_getHash(url)) || !!_matchesStarredPageX(_getHash(url)));
}

/**
 * Returns the part of the current url that precedes '#'.
 */
function getCurrentBaseUrl() {
    const url = window.location.href;
    const parts = url.split('#');
    return parts[0];
}

function _getHash(url) {
    const hash = url.split('#')[1];
    // # might be followed by ?
    const index = hash.indexOf('?');

    return index > 0 ? hash.substring(0, index) : hash;
}

function _matchesPage1(hash) {
    return hash === 'inbox';
}

function _matchesPageX(hash) {
    return hash.match(/^inbox\/p(\d+)$/);
}

function _matchesStarredPage1(hash) {
    return hash === Urls.STARRED_PAGE_HASH;
}

function _matchesStarredPageX(hash) {
    return hash.match(/^search\/is%3Astarred\+label%3Ainbox\/p(\d+)$/)
}

export {
    getCurrentPageNumber, 
    getPageNumber,
    getCurrentTab,
    supportsBundling,
    isStarredPage,
    getCurrentBaseUrl,
};