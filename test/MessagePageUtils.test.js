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
    supportsBundling,
    getPageNumber,
    isStarredPage,
} from '../src/util/MessagePageUtils';

//
// supportsBundling
//

test('supportsBundling - basic', () => {
    expect(supportsBundling('https://mail.google.com/mail/u/0/')).toBe(true);
});

test('supportsBundling - inbox pages', () => {
    expect(supportsBundling('https://mail.google.com/mail/u/0/#inbox')).toBe(true);
    expect(supportsBundling('https://mail.google.com/mail/u/0/#inbox/p2')).toBe(true);
});

test('supportsBundling - inbox pages with additional params', () => {
    expect(supportsBundling('https://mail.google.com/mail/u/0/#inbox/p2?compose=new'))
        .toBe(true);
    expect(supportsBundling('https://mail.google.com/mail/u/0/?zx=v1c311gis0ky#inbox'))
        .toBe(true);
    expect(supportsBundling('https://mail.google.com/mail/u/0/?zx=v1c311gis0ky#inbox/p2'))
        .toBe(true);
});

test('supportsBundling - other', () => {
    expect(supportsBundling('https://mail.google.com/mail/u/0/#label/Dentist')).toBe(false);
});

test('supportsBundling - search pages w/ "inbox"', () => {
    expect(supportsBundling('https://mail.google.com/mail/u/0/#search/is%3Astarred+label%3Ainbox'))
        .toBe(false);
    expect(supportsBundling('https://mail.google.com/mail/u/0/#search/is%3Astarred+label%3Ainbox/p2'))
        .toBe(false);
});


//
// getPageNumber
//
test('getPageNumber', () => {
    expect(getPageNumber('https://mail.google.com/mail/u/0/#inbox')).toBe(1);
    expect(getPageNumber('https://mail.google.com/mail/u/0/#inbox/p2')).toBe(2);
    expect(getPageNumber('https://mail.google.com/mail/u/0/#inbox/p13')).toBe(13);
});


//
// isStarredPage
//
test('isStarredPage', () => {
    expect(isStarredPage('https://mail.google.com/mail/u/0/#search/is%3Astarred+label%3Ainbox'))
        .toBe(true);
    expect(isStarredPage('https://mail.google.com/mail/u/0/#search/is%3Astarred+label%3Ainbox/p2'))
        .toBe(true);
    expect(isStarredPage('https://mail.google.com/mail/u/0/#search/is%3Astarred+label%3Ainbox/p2a'))
        .toBe(false);
    expect(isStarredPage('https://mail.google.com/mail/u/0/#search/is%3Astarred+label%3Ainbox/FaNEpwVn'))
        .toBe(false);
    expect(isStarredPage('https://mail.google.com/mail/u/0/'))
        .toBe(false);
});
