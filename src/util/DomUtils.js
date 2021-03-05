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
    Selectors,
} from './Constants';

const DomUtils = {
    findMessageRow: function(messageRowDescendant) {
        return messageRowDescendant.closest('tr');
    },

    extractDate: function(message) {
        return message.querySelector(Selectors.MESSAGE_DATE).title
    },

    isChecked: function(checkboxNode) {
        return checkboxNode.getAttribute('aria-checked') === 'true';
    },

    getLabels: function(message) {
        return [...message.querySelectorAll(Selectors.LABELS)];
    },

    /** Slice entries out of an object. */
    slice: function(src, ...keys) {
        const dst = {};
        for (const k of keys) {
            dst[k] = src[k];
        }
        return dst;
    },

    getCSS: function(element, ...cssAttributes) {
        const cssObj = {};
        const csm = element.computedStyleMap();
        for (let sty of cssAttributes) {
            cssObj[sty] = csm.get(sty).toString();
        }
        return cssObj;
    },

    styleFor: function(cssObj) {
        const css = Object.entries(cssObj).map(([k, v]) => `${k}: ${v};`).join("\n\t");
        const [hasSingleQuote, hasDoubleQuote] = ["'", '"'].map(q => css.indexOf(q) > -1);
        if (hasSingleQuote && hasDoubleQuote) {
            return "";  // Safely-punt on safely-quoting the css.
        } else if (hasSingleQuote) {
            return `style="${css}"`;
        } else {
            return `style='${css}'`;
        }
    },

    htmlToElement: function(html) {
        var template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    }
}

export default DomUtils;
