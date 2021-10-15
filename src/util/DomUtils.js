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
    
    // TODO: Breaking change.  Make sure to change all call sites
    // TODO: Rename to getLabels
    getLabelStrings: function(message) {
        return [...message.querySelectorAll(Selectors.LABELS)].map(l => ({
            title: l.title,
            backgroundColor: l.style.backgroundColor,  //TODO: Is this the best way to get it?
            borderColor: l.style.borderColor,
            textColor: l.querySelectorAll(Selectors.LABEL_TEXT)[0].style.color
        }));
    },

    htmlToElement: function(html) {
        var template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    }
}

export default DomUtils;