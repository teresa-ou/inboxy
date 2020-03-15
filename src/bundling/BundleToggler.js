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

import { getCurrentPageNumber } from '../util/MessagePageUtils';
import { 
    InboxyClasses, 
    Selectors, 
    ORDER_INCREMENT,
} from '../util/Constants';

/**
 * Opens/closes bundles to show/hide bundled messages.
 */
class BundleToggler {
    constructor(bundledMail) {
        this.bundledMail = bundledMail;
        
        this.toggleBundle = this.toggleBundle.bind(this);
        this.openBundle = this.openBundle.bind(this);
        this.closeAllBundles = this.closeAllBundles.bind(this);
    }

    toggleBundle(label) {
        const openedBundleLabel = this.bundledMail.getLabelOfOpenedBundle();

        if (openedBundleLabel) {
            this.closeAllBundles();
        }

        if (openedBundleLabel !== label) {
            this.openBundle(label);
        }
    }

    openBundle(label) {
        this.bundledMail.openBundle(label);
        const bundle = this.bundledMail.getBundle(label);

        // Set order for bundled messages and make them visible
        const messages = bundle.getMessages();
        messages.forEach((el, i) => {
            el.style.order = bundle.getOrder() + i + 1;
            el.classList.add(InboxyClasses.VISIBLE);

            if (i === messages.length - 1) {
                el.classList.add(InboxyClasses.LAST);
            }

            // Hide redundant labels
            el.querySelectorAll(Selectors.LABEL_CONTAINERS).forEach(lc => {
                if (lc.childNodes[0].title === label) {
                    lc.style.display = 'none';
                }
            });
        });

        const bundleRow = bundle.getBundleRow();
        bundleRow.classList.add(InboxyClasses.VISIBLE);
        // Remove top margin when bundle row follows a date divider
        if (bundleRow.previousSibling && 
            bundleRow.previousSibling.classList.contains('date-row') &&
            bundle.getOrder() - bundleRow.previousSibling.style.order <= ORDER_INCREMENT)
        {
            bundleRow.style.marginTop = '0';
        }

        this._showBundleArea(bundle);
    }

    closeAllBundles() {
        const openedBundleLabel = this.bundledMail.getLabelOfOpenedBundle();
        if (!openedBundleLabel) {
            return;
        }

        this.bundledMail.closeBundle();

        // Remove styles that were added when the bundle was opened
        document.querySelectorAll(`.${InboxyClasses.BUNDLED_MESSAGE}.${InboxyClasses.VISIBLE}`)
            .forEach(el => {
                el.style.order = '';
                el.classList.remove(InboxyClasses.VISIBLE);
                el.classList.remove(InboxyClasses.LAST);

                // Unhide labels
                el.querySelectorAll(Selectors.LABEL_CONTAINERS).forEach(lc => {
                    if (lc.style.display) {
                        lc.style.display = '';
                    }
                });
            });

        document.querySelectorAll(`.${InboxyClasses.BUNDLE_ROW}.${InboxyClasses.VISIBLE}`)
            .forEach(el => {
                el.classList.remove(InboxyClasses.VISIBLE);
                el.style.marginTop = '';
            });        

        document.querySelectorAll('.bundle-area')
            .forEach(bundleArea => bundleArea.style.display = '');
    }

    _showBundleArea(bundle) {
        const bundleArea = document.querySelector(`${Selectors.CURRENT_TABPANEL} .bundle-area`);
        bundleArea.style.display = 'block';

        const top = BundleToggler._calculateBundleAreaTop(bundle.getBundleRow());
        bundleArea.style.top = `${top}px`;
        
        const height = BundleToggler._calculateBundleAreaHeight(bundle.getMessages());
        bundleArea.style.height = `${height}px`;
    }

    static _calculateBundleAreaTop(bundleRow) {
        return bundleRow.offsetTop + bundleRow.offsetHeight;
    }

    static _calculateBundleAreaHeight(messages) {
        return (messages[messages.length - 1].offsetTop - messages[0].offsetTop) + 
            messages[messages.length - 1].offsetHeight;
    }
}

export default BundleToggler;