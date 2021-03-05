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
 * A bundle of messages that belong to a particular label.
 */
class Bundle {
    constructor(label, style) {
        this._label = label;
        this._style = style;
        this._bundleRow = null;
        this._order = null;
        this._messages = [];
    }

    setBundleRow(bundleRow) {
        this._bundleRow = bundleRow;
    }

    setOrder(order) {
        this._order = order;
    }

    addMessage(message) {
        this._messages.push(message);
    }

    /**
     * The label text associated with this bundle.
     */
    getLabel() {
        return this._label;
    }
    
    /**
     * The style associated with this bundle.
     */
    getStyle() {
        return this._style;
    }

    /**
     * The dom element for the table row representing the bundle.
     */
    getBundleRow() {
        return this._bundleRow;
    }

    /**
     * The order property for the bundle row.
     */
    getOrder() {
        return this._order;
    }

    /**
     * A list of message dom elements, for messages in the bundle.
     */
    getMessages() {
        return this._messages;
    }
}

export default Bundle;
