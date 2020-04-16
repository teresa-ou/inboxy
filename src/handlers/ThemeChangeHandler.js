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
    InboxyClasses,
    Selectors,
} from '../util/Constants';

/**
 * Handles changes in Gmail themes and updates inboxy theme styling accordingly.
 */
class ThemeChangeHandler {
    constructor() {
        this.observer = new MutationObserver(mutations => {
            // When the theme is updated, the contents of a style tag are updated
            if (mutations.some(m => m.target.tagName === 'STYLE')) {
                this._applyTheme();
            }            
        });
    }

    /**
     * Observe and react to theme changes.
     */
    observe() {
        this._applyTheme();

        this.observer.observe(document.querySelector('head'), { 
            attributes: false, 
            childList: true, 
            subtree: true,
        });

        // Re-apply theme on hashchange, since messages-dark-theme relies on
        // messages being present on the current page
        window.addEventListener('hashchange', e => this._applyTheme());
    }

    /**
     * Apply the appropriate light/dark theme styling, so that inboxy theming matches Gmail.
     */
    _applyTheme() {
        const node = document.querySelector('html');
        const sidepaneText = document.querySelector(Selectors.SIDEPANE_TEXT);
        if (this._isLight(getComputedStyle(sidepaneText).color)) {
            node.classList.add(InboxyClasses.DARK_THEME);
        }
        else {
            node.classList.remove(InboxyClasses.DARK_THEME);
        }

        const message = document.querySelector(Selectors.SAMPLE_MESSAGE);
        if (!message) {
            return;
        }
        if (!this._isLight(getComputedStyle(message).backgroundColor)) {
            node.classList.add(InboxyClasses.MESSAGES_DARK_THEME);
        }
        else {
            node.classList.remove(InboxyClasses.MESSAGES_DARK_THEME);
        }

        if (message.clientHeight <= 28) {
            node.classList.add('compact');
        }
        else {
            node.classList.remove('compact');
        }
    }

    /**
     * Whether the color represented by the rgb string is closer to white than to black.
     */
    _isLight(rgbString) {
        const rgb = this._rgbStringToRgb(rgbString);
        const intensity = this._rgbToGrayscale(rgb);

        return intensity > (255 / 2);
    }

    /**
     * Converts an rgb(a) string, ex. 'rgb(243, 128, 4)' or 'rgba(243, 128, 4, 0.8)', to an 
     * array of rgb values. The alpha value is discarded.
     */
    _rgbStringToRgb(rgbString) {
        const openParenIndex = rgbString.indexOf('(');
        const rgbValues = rgbString.substring(openParenIndex + 1, rgbString.length - 1);
        return rgbValues.split(',').map(s => parseInt(s.trim())).slice(0, 3);
    }

    /** 
     * Converts an array of RGB values to grayscale intensity value.
     */
    _rgbToGrayscale(rgb) {
        return (rgb[0] + rgb[1] + rgb[2]) / 3;
    }
}

export default ThemeChangeHandler;