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

const PLACEHOLDER = 'Add the name of each bundle on a new line, for example:\n\nBank\nSchool\nAppointments';

function saveOptions() {
    const exclude = document.getElementById('exclude-radio').checked;
    const labelList = document.getElementById('label-list');
    const labels = labelList.value.split(/[\n]+/).map(s => s.trim()).filter(s => !!s);
    const groupMessagesByDate = document.getElementById('group-by-date-checkbox').checked;

    chrome.storage.sync.set({
        exclude: !!exclude,
        labels: labels,
        groupMessagesByDate: !!groupMessagesByDate,
    }, function() {
        labelList.value = labels.join('\n');

        const saveButton = document.getElementById('save-button');
        saveButton.classList.add('saved');
        setTimeout(() => {
            saveButton.classList.remove('saved');
        }, 3000);
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        exclude: true,
        labels: [],
        groupMessagesByDate: true,
    }, function(items) {
        const id = items.exclude ? 'exclude-radio' : 'include-radio';
        document.getElementById(id).checked = true;

        const labelList = document.getElementById('label-list');
        labelList.value = items.labels.join('\n');
        if (!items.labels.length) {
          labelList.placeholder = PLACEHOLDER;
        }

        document.getElementById('group-by-date-checkbox').checked = items.groupMessagesByDate;

    });
}
document.getElementById('save-button').addEventListener('click', saveOptions);


//
// Tabs for options page
//

function selectTab(tabIndex, subtitle) {
    const tabs = [...document.querySelectorAll('main .tab')];
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = i === tabIndex ? 'block' : 'none';
    }

    const tabLinks = [...document.querySelectorAll('.nav-links li')];
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].style.fontWeight = i === tabIndex ? '700' : '';
    }

    document.querySelector('title').innerText = `inboxy - ${subtitle}`;
}

document.querySelectorAll('.nav-links li').forEach((e, i) => {
    e.addEventListener('click', () => selectTab(i, e.innerText));
});

function initializeTab() {
    // Set the initial tab, based on the hash
    const parts = window.location.href.split('#');
    if (parts.length < 2 || parts[1].length === 0) {
        selectTab(1, 'Options');
        restoreOptions();
    }
    else if (parts[1] === 'help') {
        selectTab(2, 'Help');
    }
    else {
        selectTab(0, 'Get started');
    }
}

initializeTab();
window.addEventListener('hashchange', initializeTab);
