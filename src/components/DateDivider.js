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

import DomUtils from '../util/DomUtils';
import {
    Selectors
} from '../util/Constants';

/**
 * Helper functions for creating rows that divide messages into groups by date, 
 * ex. "Today", "Yesterday", "This month", etc.
 */

const DividerDate = {
    TODAY: { value: 1, text: 'Today' },
    YESTERDAY: { value: 2, text: 'Yesterday' },
    THIS_MONTH: { value: 3, text: 'This month' },
    LAST_MONTH: { value: 4, text: 'Last month' },
    EARLIER: { value: 5, text: 'Earlier' }
};

/**
 * Return a list of date dividers, based on the provided current date. 
 * 
 * Date dividers are objects with the fields 'value' (enum value), 'text' (displayed to user), and 
 * 'endDate' (date defining the end of the time range);
 *
 * If date dividers aren't supported for dates in a format of the sampleDateString, returns 
 * an empty list.
 */
function getDateDividers(sampleDateString, now) {
    if (!_isDateDividerSupported(sampleDateString)) {
        return [];
    }

    const today = new Date(now.getTime());
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    const tomorrow = new Date(today.getTime());
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(today.getTime());
    yesterday.setDate(yesterday.getDate() - 1);

    const monthStart = new Date(today.getTime());
    monthStart.setDate(1);

    const lastMonthStart = new Date(monthStart.getTime());
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

    const useThisMonth = yesterday.getTime() > monthStart.getTime();

    return [
        { 
            ...DividerDate.TODAY,
            endDate: tomorrow
        },
        {
            ...DividerDate.YESTERDAY,
            endDate: today
        },
        {
            ...(useThisMonth ? DividerDate.THIS_MONTH : DividerDate.LAST_MONTH),
            endDate: yesterday
        },
        {
            ...DividerDate.EARLIER,
            endDate: useThisMonth ? monthStart : lastMonthStart
        }
    ];
}

function _isDateDividerSupported(sampleDateString) {
    if (!sampleDateString) {
        return false;
    }

    return !!_parseDate(sampleDateString);
}

function _parseDate(dateString) {
    const date = Date.parse(dateString);
    if (date === NaN) {
        return null;
    }

    return new Date(date);
}

/**
 * Returns the date divider object that should be used to divide prev and curr message node,
 * if any, or null otherwise. 
 */
function shouldInsertDateDivider(prevMessageNode, currMessageNode, dateDividers) {
    for (let i = dateDividers.length - 1; i >= 0; i--) {
        const dividerDate = dateDividers[i].endDate;
        const prevDate = prevMessageNode 
            ? _extractMessageDate(prevMessageNode) 
            : null;
        const currDate = _extractMessageDate(currMessageNode);

        if ((prevDate == null || prevDate >= dividerDate) && dividerDate > currDate) {
            return dateDividers[i];
        }
    }

    return null;
}

function _extractMessageDate(message) {
    return _parseDate(DomUtils.extractDate(message));
}

/**
 * Create a date divider row.
 */
function create(divider, order) {
    const el = document.createElement('div');
    el.classList.add('date-row');
    el.innerHTML += divider.text;
    el.style.order = order;

    return el;
}

export default {
    getDateDividers,
    shouldInsertDateDivider,
    create,
};
