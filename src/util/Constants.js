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
 * The amount that the order property is incremented by,
 * for non-bundled-message elements. 
 *
 * This should be equal to (or greater than) the maximum number of messages per page,
 * since we reserve the order numbers in between the jumps for bundled messages. 
 * (Worst case, all messages on a page share a common label, and all belong in the same bundle.)
 */
const ORDER_INCREMENT = 100;

const NO_TAB = '__NO_TAB';

const GmailClasses = {
    ARCHIVE_BUTTON: 'brq bqX',
    CELL: 'xY',
    DATE_CELL: 'xW',
    IMPORTANCE_MARKER: 'WA',
    PERSONAL_LEVEL_INDICATOR: 'bnk',
    READ: 'yO',
    ROW: 'zA',
    SELECTED: 'x7',
    SNOOZED: 'cL',
    STARRED: 'T-KT-Jp',
    SUBJECT_CELL: 'a4W',
    UNREAD: 'zE',
    UNREAD_SENDER: 'zF',
};

const InboxyClasses = {
    BUNDLE_ROW: 'bundle-row',
    BUNDLED_MESSAGE: 'bundled-message',
    DARK_THEME: 'dark-theme',
    MESSAGES_DARK_THEME: 'messages-dark-theme',
    INBOXY: 'inboxy',
    LAST: 'last',
    SHOW_PINNED_TOGGLE: 'show-pinned-toggle',
    VIEW_ALL_LINK: 'view-all-link',
    VISIBLE: 'visible',
};

const PAGE = '.BltHke.nH.oy8Mbf';
const MAIN = `[role="main"]`;
const CURRENT_TABPANEL = `${MAIN} .ae4:not([style*="none"])`;
const POSSIBLE_MESSAGE_LISTS = `${CURRENT_TABPANEL} .Cp`; 
const LABELS = `.ar.as .at`;
const Selectors = {
    CHECKBOXES: `${CURRENT_TABPANEL} tr td .oZ-jc.T-Jo.J-J5-Ji`,
    CURRENT_TAB: `${MAIN} [role="tab"][aria-selected="true"]`,
    CURRENT_TABPANEL: CURRENT_TABPANEL,
    INBOX_LABEL: `${LABELS}[title="Inbox"]`,
    INBOXY: `.${InboxyClasses.INBOXY}`,
    LABEL_LEAF: '.au .av',
    LABEL_CONTAINERS: '.ar.as',
    LABELS: LABELS,
    IMPORTANCE_MARKER: `.${GmailClasses.ROW} .${GmailClasses.IMPORTANCE_MARKER}`,
    INBOX_TAB: '.TO[data-tooltip="Inbox"]',
    MAIN: MAIN,
    MESSAGE_CHECKBOX: '.oZ-jc.T-Jo.J-J5-Ji',
    MESSAGE_DATE: '.xW span',
    MESSAGE_DATE_SPAN: `.xW span span`,
    MESSAGE_SNOOZED_TEXT: `.byZ.xY .cL`,
    POSSIBLE_MESSAGE_LISTS: POSSIBLE_MESSAGE_LISTS,
    PAGE: PAGE,
    PAGECHANGING_BUTTONS: '.ar5 .Di *',
    PERSONAL_LEVEL_INDICATOR:   
        `.${GmailClasses.ROW} > .${GmailClasses.PERSONAL_LEVEL_INDICATOR}:not(.byv)`,
    READ_MESSAGE: `tr.${GmailClasses.ROW}.${GmailClasses.READ}`,
    REFRESH: '.T-I.J-J5-Ji[act="20"]',
    SAMPLE_MESSAGE: `${POSSIBLE_MESSAGE_LISTS} tr.${GmailClasses.ROW}.${GmailClasses.READ}:not(.bundled-message)`,
    SEARCH_FORM: '#gb form',
    SELECTED: `${CURRENT_TABPANEL} tr.${GmailClasses.SELECTED}:not(.${InboxyClasses.BUNDLE_ROW})`,
    SENDERS: '.yX.xY .yW .bA4 span[email]',
    SCROLLABLE_CONTAINER: '.Tm.aeJ',
    SIDEPANE_TEXT: '.TO .nU',
    STARRED: `.T-KT.${GmailClasses.STARRED}`,
    TAB: `${MAIN} [role="tab"]`,
    TABPANELS: `${MAIN} [role="tabpanel"]`,
    TABLE_BODY: `.F tbody`,
    TOOLBAR_ARCHIVE_BUTTON: `.G-atb:not([style*="none"]) .T-I.J-J5-Ji[act="7"]`,
    UNSTARRED: `.T-KT.aXw`,
};

// Selectors for elements assuming we are selecting within TABLE_BODY
const TableBodySelectors = {
    MESSAGE_NODES: `tr.${GmailClasses.ROW}`,
};

const Urls = {
    STARRED_PAGE_HASH: 'search/is%3Astarred+label%3Ainbox',
};

const Element = {
    DATE_DIVIDER: 1,
    BUNDLE: 2,
    UNBUNDLED_MESSAGE: 3,
};

export { 
    ORDER_INCREMENT, 
    NO_TAB,
    GmailClasses, 
    InboxyClasses,
    Selectors, 
    TableBodySelectors,
    Urls,
    Element,
};
