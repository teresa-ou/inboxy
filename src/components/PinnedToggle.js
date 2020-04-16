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
    Urls,
    InboxyClasses,
} from '../util/Constants';
import DomUtils from '../util/DomUtils';
import {
    supportsBundling,
    isStarredPage,
    getCurrentBaseUrl,
} from '../util/MessagePageUtils';

/**
 * Toggle between the inbox and pinned messages.
 */
class PinnedToggle {
    constructor() {
        this.showPinned = false;
        this.baseUrl = getCurrentBaseUrl();

        this._onHashChange = this._onHashChange.bind(this);
        this._toggle = this._toggle.bind(this);

        window.addEventListener('hashchange', this._onHashChange);
    }

    /** 
     * Returns a toggle dom element that changes state on hashchange and click events.
     */
    create() {
        const anchorElement = DomUtils.htmlToElement(`
            <a href="">
                <div class="slider">
                    <div class="slider-button"></div>
                </div>
            </a>
        `);
        // Toggle immediately on click
        //
        // The new state of the toggle should be correct, but in case it isn't, the state
        // also gets set based on the url upon hashchange
        anchorElement.addEventListener('click', this._toggle);

        const toggleElement = DomUtils.htmlToElement(`<div class="pinned-toggle"></div>`);
        toggleElement.appendChild(anchorElement);

        this.toggleElement = toggleElement;
        this.anchorElement = anchorElement;

        this._updateToggle(window.location.href);

        return this.toggleElement;
    }

    /**
     * Toggle the state visually. 
     */
    _toggle() {
        if (this.toggleElement.classList.contains('show-pinned')) {
            this.toggleElement.classList.remove('show-pinned');
        }
        else {
            this.toggleElement.classList.add('show-pinned');
        }
    }
    
    /**
     * Set the state based on the current url.
     */
    _onHashChange(e) {
        this._updateToggle(e.newURL);
    }

    /**
     * Update the link and styling of the toggle based on the current url,
     * or hide the toggle if it shouldn't be shown.
     */
    _updateToggle(url) {
        if (isStarredPage(url)) {
            this.toggleElement.style = {};
            this.anchorElement.href = `${this.baseUrl}#inbox`;
            this.toggleElement.classList.add('show-pinned');
            document.querySelector('html').classList.add(InboxyClasses.SHOW_PINNED_TOGGLE);
        }
        else if (supportsBundling(url)) {
            this.toggleElement.style = {};
            this.anchorElement.href = `${this.baseUrl}#${Urls.STARRED_PAGE_HASH}`;
            this.toggleElement.classList.remove('show-pinned');
            document.querySelector('html').classList.add(InboxyClasses.SHOW_PINNED_TOGGLE);
        } 
        else {
            document.querySelector('html').classList.remove(InboxyClasses.SHOW_PINNED_TOGGLE);
            this.toggleElement.style.display = 'none';
        }
    }
} 

export default PinnedToggle;