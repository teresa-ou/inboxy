import { expect } from 'chai';

import { 
    supportsBundling,
    getPageNumber,
    isStarredPage,
} from '../src/util/MessagePageUtils';

//
// supportsBundling
//

expect(supportsBundling('https://mail.google.com/mail/u/0/')).to.equal(true);

// Inbox pages
expect(supportsBundling('https://mail.google.com/mail/u/0/#inbox')).to.equal(true);
expect(supportsBundling('https://mail.google.com/mail/u/0/#inbox/p2')).to.equal(true);

// Inbox pages with additional params
expect(supportsBundling('https://mail.google.com/mail/u/0/#inbox/p2?compose=new')).to.equal(true);
expect(supportsBundling('https://mail.google.com/mail/u/0/?zx=v1c311gis0ky#inbox')).to.equal(true);
expect(supportsBundling('https://mail.google.com/mail/u/0/?zx=v1c311gis0ky#inbox/p2')).to.equal(true);

// Other pages
expect(supportsBundling('https://mail.google.com/mail/u/0/#label/Dentist')).to.equal(false);

// Search pages, involving "inbox" in the search term
expect(supportsBundling('https://mail.google.com/mail/u/0/#search/is%3Astarred+label%3Ainbox'))
    .to.equal(false);
expect(supportsBundling('https://mail.google.com/mail/u/0/#search/is%3Astarred+label%3Ainbox/p2'))
    .to.equal(false);


//
// getPageNumber
//

expect(getPageNumber('https://mail.google.com/mail/u/0/#inbox')).to.equal(1);
expect(getPageNumber('https://mail.google.com/mail/u/0/#inbox/p2')).to.equal(2);
expect(getPageNumber('https://mail.google.com/mail/u/0/#inbox/p13')).to.equal(13);


//
// isStarredPage
//

expect(isStarredPage('https://mail.google.com/mail/u/0/#search/is%3Astarred+label%3Ainbox'))
    .to.equal(true);
expect(isStarredPage('https://mail.google.com/mail/u/0/#search/is%3Astarred+label%3Ainbox/p2'))
    .to.equal(true);
expect(isStarredPage('https://mail.google.com/mail/u/0/#search/is%3Astarred+label%3Ainbox/p2a'))
    .to.equal(false);
expect(isStarredPage('https://mail.google.com/mail/u/0/#search/is%3Astarred+label%3Ainbox/FaNEpwVn'))
    .to.equal(false);
expect(isStarredPage('https://mail.google.com/mail/u/0/'))
    .to.equal(false);
