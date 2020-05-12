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

import DateDivider from '../src/components/DateDivider';
import { Element } from '../src/util/Constants';
import DomUtils from '../src/util/DomUtils';

const NOW = new Date(2020, 2, 15, 13);
const SAMPLE_DATE = String(NOW);
const DATE_DIVIDERS = DateDivider._getDateDividers(SAMPLE_DATE, NOW);

const TODAY = new Date(2020, 2, 15, 9);
const YESTERDAY = new Date(2020, 2, 14, 10);
const THIS_MONTH = new Date(2020, 2, 2, 5);

function createMockRow(id, date, snoozed = false) {
    const snoozedCell = snoozed ? '<td class="byZ xY"><div class="cL"></div></td>' : '';

    const element = DomUtils.htmlToElement(`
        <tr>
            ${snoozedCell}
            <td class="xW">
                <span title="${date}">
                </span>
            </td>
        </tr>
    `);

    return {
        element,
        type: Element.UNBUNDLED_MESSAGE,
        id,
    }
}

function createDividerRow(index) {
    return {
        element: DATE_DIVIDERS[index],
        type: Element.DATE_DIVIDER,
    };
}

function testWithDateDividers(
    messagesAndBundleRows, 
    expectedOutputRows,
    sampleDate = SAMPLE_DATE) 
{
    const rows = DateDivider.withDateDividers(
        messagesAndBundleRows, 
        sampleDate,
        x => x ? x.element : null,
        () => NOW);

    expect(rows.length).toBe(expectedOutputRows.length);
    for (let i = 0; i < rows.length; i++) {
        const actual = rows[i];
        const expected = expectedOutputRows[i];

        expect(actual.type).toBe(expected.type);
        if (actual.type === Element.DATE_DIVIDER) {
            expect(actual.element.value).toBe(expected.element.value);
        }
        else if (actual.type === Element.UNBUNDLED_MESSAGE) {
            expect(actual.id).toBe(expected.id);
        }
    }
}

test('first message is snoozed', () => {
    testWithDateDividers([
            createMockRow(1, THIS_MONTH, true),
            createMockRow(2, TODAY),
            createMockRow(3, TODAY),
            createMockRow(4, YESTERDAY)
        ],
        [
            createDividerRow(0),
            createMockRow(1, THIS_MONTH, true),
            createMockRow(2, TODAY),
            createMockRow(3, TODAY),
            createDividerRow(1),
            createMockRow(4, YESTERDAY)
        ]
    );
});

test('first message is snoozed, second is not Today', () => {
    testWithDateDividers([
            createMockRow(1, THIS_MONTH, true),
            createMockRow(2, YESTERDAY)
        ],
        [
            createDividerRow(0),
            createMockRow(1, THIS_MONTH, true),
            createDividerRow(1),
            createMockRow(2, YESTERDAY)
        ]
    );
});

test('snoozed message surrounded by messages in a single date section', () => {
    testWithDateDividers([
            createMockRow(1, TODAY),
            createMockRow(2, THIS_MONTH, true),
            createMockRow(3, TODAY),
            createMockRow(4, TODAY),
            createMockRow(5, YESTERDAY)
        ],
        [
            createDividerRow(0),
            createMockRow(1, TODAY),
            createMockRow(2, THIS_MONTH, true),
            createMockRow(3, TODAY),
            createMockRow(4, TODAY),
            createDividerRow(1),
            createMockRow(5, YESTERDAY)
        ]
    );
});

test('snoozed message at boundary of date sections', () => {
    testWithDateDividers([
            createMockRow(1, TODAY),
            createMockRow(2, THIS_MONTH, true),
            createMockRow(3, YESTERDAY)
        ],
        [
            createDividerRow(0),
            createMockRow(1, TODAY),
            createMockRow(2, THIS_MONTH, true),
            createDividerRow(1),
            createMockRow(3, YESTERDAY)
        ]
    );
});

test('snoozed message in second date section', () => {
    testWithDateDividers([
            createMockRow(1, TODAY),
            createMockRow(2, YESTERDAY),
            createMockRow(3, THIS_MONTH, true),
            createMockRow(4, YESTERDAY)
        ],
        [
            createDividerRow(0),
            createMockRow(1, TODAY),
            createDividerRow(1),
            createMockRow(2, YESTERDAY),
            createMockRow(3, THIS_MONTH, true),
            createMockRow(4, YESTERDAY)
        ]
    );
});

test('invalid sample date format', () => {
    const rows = [
        createMockRow(1, TODAY),
        createMockRow(2, YESTERDAY),
        createMockRow(3, THIS_MONTH, true),
        createMockRow(4, YESTERDAY)
    ];

    testWithDateDividers(rows, rows, 'invalidSampleDate');
});


