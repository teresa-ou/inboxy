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

/**
 * Identifies the labels that have bundling enabled, according to the user's options.
 * By default, all labels are bundled.
 */
class SelectiveBundling {
    constructor() {
        const self = this;
        chrome.storage.sync.get(['exclude', 'labels'], ({ exclude = true, labels = [] }) => {
            self.exclude = exclude;
            self.labels = new Set(labels.map(s => s.toLowerCase()));
        });
    }

    filter(messageLabels) {
        if (this.exclude) {
            return messageLabels.filter(l => !this.labels.has(l.title.toLowerCase()));
        }
        else {
            return messageLabels.filter(l => this.labels.has(l.title.toLowerCase()));
        }
    }

    filterStrings(messageLabels) {
        return this.filter(messageLabels).map(l => l.title);
    }
}

export default SelectiveBundling;
