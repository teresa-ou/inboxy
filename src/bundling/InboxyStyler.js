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
} from '../util/Constants';

/**
 * Applies inboxy styling.
 */
class InboxyStyler {
    constructor(bundledMail) {
        this.bundledMail = bundledMail;
    }

    /**
     * Apply "selected" styling (i.e. checked) to all bundles that have any messages that
     * are selected.
     */
    markSelectedBundles() {
        Object.values(this.bundledMail.getAllBundles()).forEach(this._markSelectedBundle);
    }

    /**
     * Apply "selected" styling (i.e. checked) to all bundles with the given labels, that have
     * any messages that are selected.
     */
    markSelectedBundlesFor(labels) {
        labels.forEach(l => {
            const bundle = this.bundledMail.getBundle(l);
            if (!bundle) {
                return;
            }

            this._markSelectedBundle(bundle);
        });
    }

    /**
     * Apply "selected" styling to the bundle.
     */
    _markSelectedBundle(bundle) {
        const hasSelectedMessages = bundle.getMessages()
            .some(m => m.classList.contains(GmailClasses.SELECTED));

        if (hasSelectedMessages) {
            bundle.getBundleRow().classList.add(GmailClasses.SELECTED);
        }
        else {
            bundle.getBundleRow().classList.remove(GmailClasses.SELECTED);
        }
    }

    /**
     * For each bundle, disable bulk-actions if any message outside of its bundle is selected.
     */
    disableBulkActionsIfNecessary() {
        const selectedMessages = [].slice.call(
            document.querySelectorAll(Selectors.SELECTED));
        Object.values(this.bundledMail.getAllBundles()).forEach(bundle => 
            this._updateBulkActionButtons(bundle, selectedMessages));
    }

    /**
     * Enable/disable the bulk action buttons for the given bundle.
     */
    _updateBulkActionButtons(bundle, selectedMessages) {
        const bundledMessageIds = new Set(bundle.getMessages().map(m => m.id));
        const allSelectedMessagesInBundle = !selectedMessages.some(
            m => !bundledMessageIds.has(m.id));
        const bulkActionButtons = bundle.getBundleRow().getElementsByClassName('bulk-action');

        if (allSelectedMessagesInBundle) {
            for (const bulkActionButton of bulkActionButtons) {
                bulkActionButton.classList.remove('disabled');
            }
        }
        else {
            for (const bulkActionButton of bulkActionButtons) {
                bulkActionButton.classList.add('disabled');
            }
        }
    }
}

export default InboxyStyler;