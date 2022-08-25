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

        const pane = document.querySelector(Selectors.MESSAGE_PANE);
        if (!pane) {
            return;
        }
        const paneColor = getComputedStyle(pane).backgroundColor;

        if (!this._isLight(paneColor)) {
            node.classList.add(InboxyClasses.MESSAGES_DARK_THEME);
        }
        else {
            node.classList.remove(InboxyClasses.MESSAGES_DARK_THEME);
        }
        if (this._isWhite(paneColor)) {
            node.classList.add(InboxyClasses.MESSAGES_DEFAULT_THEME);
        }
        else {
            node.classList.remove(InboxyClasses.MESSAGES_DEFAULT_THEME);
        }

        const message = document.querySelector(Selectors.SAMPLE_MESSAGE);
        if (!message) {
            return;
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
        const rgba = this._rgbStringToRgba(rgbString);
        const intensity = this._rgbToGrayscale(rgba);

        return intensity > (255 / 2);
    }

    /** 
     * Whether the color represented by the rgb string is white.
     */
    _isWhite(rgbString) {
        const rgba = this._rgbStringToRgba(rgbString);

        return rgba.slice(0, 3).every(v => v === 255) && rgba[3] === 1;
    }

    /**
     * Converts an rgb(a) string, ex. 'rgb(243, 128, 4)' or 'rgba(243, 128, 4, 0.8)', to an 
     * array of rgba values.
     */
    _rgbStringToRgba(rgbString) {
        const openParenIndex = rgbString.indexOf('(');
        const rgbaValues = rgbString.substring(openParenIndex + 1, rgbString.length - 1).split(',');
        const alpha = rgbaValues.length === 3 ? 1 : parseFloat(rgbaValues[3]);
        return [...rgbaValues.slice(0, 3).map(s => parseInt(s.trim())), alpha];
    }

    /** 
     * Converts an array of RGB values to grayscale intensity value.
     */
    _rgbToGrayscale(rgb) {
        return (rgb[0] + rgb[1] + rgb[2]) / 3;
    }
}

export default ThemeChangeHandler;