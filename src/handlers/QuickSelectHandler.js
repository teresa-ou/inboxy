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
} from '../util/Constants';
import { getCurrentPageNumber } from '../util/MessagePageUtils';
import DomUtils from '../util/DomUtils';

/**
 * Enable quick selection of multiple messages via shift + click.
 *
 * To do so, this class actually listens to all clicks to checkboxes (even when shift key is not 
 * pressed), since click history is needed to determine whether messages should be selected or 
 * deselected.
 */
class QuickSelectHandler {

    constructor() {
        this.mostRecentCheckboxClick = null;
        this.handleCheckboxClick = this.handleCheckboxClick.bind(this);

        window.addEventListener('hashchange', () => this.mostRecentCheckboxClick = null);
    }

    /**
     * Handler for when a checkbox is clicked.
     *
     * Assumes that this handler will be applied to checkbox dom elements of the same kind, with 
     * unique ids.
     */
    handleCheckboxClick(e) {
        // Only handle real clicks
        if (!(e.clientX && e.clientY)) {
            return;
        }

        // Prevent gmail's shift + click handler from operating
        e.stopPropagation();
        
        const target = e.target;
        if (e.shiftKey && this.mostRecentCheckboxClick) {
            const { minOrder, maxOrder } = this._calculateOrderRange(
                document.getElementById(this.mostRecentCheckboxClick.checkboxId),
                target);
            const checkboxes = document.querySelectorAll(Selectors.CHECKBOXES);

            this._selectMessagesInBetween(
                checkboxes, minOrder, maxOrder, this.mostRecentCheckboxClick.isChecked);
            target.focus();
        }
        else {
            target.click();
        }

        this.mostRecentCheckboxClick = {
            checkboxId: target.id,
            isChecked: DomUtils.isChecked(target)
        };
    }

    /**
     * Returns an object with minOrder and maxOrder of the messages corresponding to the given 
     * checkboxes.
     */
    _calculateOrderRange(checkbox1, checkbox2) {
        const order1 = this._getOrder(checkbox1);
        const order2 = this._getOrder(checkbox2);
        let minOrder;
        let maxOrder;
        if (order1 < order2) {
            minOrder = order1;
            maxOrder = order2;
        }
        else {
            minOrder = order2;
            maxOrder = order1;
        }

        return { minOrder, maxOrder };
    }

    /**
     * Simulate clicks on messages that are visually between the target element and 
     * the most recently clicked element (inclusive) s.t. the checked state will match that of the 
     * most recently clicked element.
     */
    _selectMessagesInBetween(checkboxes, minOrder, maxOrder, isChecked) {
        checkboxes.forEach(checkbox => {
            const order = DomUtils.findMessageRow(checkbox).style.order;
            if (minOrder <= order && 
                order <= maxOrder && 
                isChecked !== DomUtils.isChecked(checkbox)) 
            {
                checkbox.click();
            }
        });
    }

    /**
     * Return the order of the given checkbox's message.
     */
    _getOrder(checkbox) {
        return parseInt(DomUtils.findMessageRow(checkbox).style.order);
    }
}

export default QuickSelectHandler;
