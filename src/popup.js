'use strict';

import './popup.css';

// Elements
const startDateElement = document.getElementById('startDate');
const endDateElement = document.getElementById('endDate');
const keywordsElement = document.getElementById('keywords');
const categoryElement = document.getElementById('category');

// Button elements
const searchButton = document.getElementById('searchButton');
const cancelButton = document.getElementById('cancelButton');
const resultsButton = document.getElementById('resultsButton');

// Span listeners
const runningSpan = document.getElementById('loadingSpan');
const canceledSpan = document.getElementById('canceledSpan');
const searchDoneSpan = document.getElementById('searchDoneSpan');
const noResultsSpan = document.getElementById('noResultsSpan');
const loadingSpan = document.getElementById('loadingSpan');

// Error messages
const keywordsError = document.getElementById('keywordsError');
const startDateError = document.getElementById('startDateError');
const endDateError = document.getElementById('endDateError');
const dateRangeError = document.getElementById('dateRangeError');
const categoryError = document.getElementById('categoryError');

const hideElement = (elem) => {
    elem.style.display = 'none';
}

const showElement = (elem) => {
    elem.style.display = '';
}

const disableElement = (elem) => {
    elem.disabled = true;
}

const enableElement = (elem) => {
    elem.disabled = false;
}

const handleOnSearchState = () => {
    // Spans
    showElement(runningSpan);
    hideElement(canceledSpan);
    hideElement(searchDoneSpan);
    hideElement(noResultsSpan);
    hideElement(loadingSpan)
    hideElement(resultsButton);
    // Buttons
    disableElement(searchButton);
    enableElement(cancelButton);
    // Inputs
    disableElement(keywordsElement);
    disableElement(startDateElement);
    disableElement(endDateElement);
    // Errors
    hideElement(keywordsError);
    hideElement(startDateError);
    hideElement(endDateError);
    hideElement(dateRangeError);
    hideElement(categoryError);
}

const handleOnCancelState = () => {
    // Spans
    showElement(canceledSpan);
    hideElement(runningSpan);
    hideElement(searchDoneSpan);
    hideElement(noResultsSpan);
    hideElement(loadingSpan)
    hideElement(resultsButton);
    // Buttons
    enableElement(searchButton);
    disableElement(cancelButton);
    // Inputs
    enableElement(keywordsElement);
    enableElement(startDateElement);
    enableElement(endDateElement);
    // Errors
    hideElement(keywordsError);
    hideElement(startDateError);
    hideElement(endDateError);
    hideElement(dateRangeError);
    hideElement(categoryError);
}

const performOnSearchValidations = () => {
    const noDateCheckbox = document.getElementById('noDateCheckbox');

    if (!keywordsElement.value) {
        showElement(keywordsError);
    } else {
        hideElement(keywordsError);
    }

    if (!categoryElement.value) {
        showElement(categoryError);
    } else {
        hideElement(categoryError);
    }

    let datesValid = true;
    if (!noDateCheckbox.checked) {
        if (!startDateElement.value) {
            showElement(startDateError);
            datesValid = false;
        } else {
            hideElement(startDateError);
        }

        if (!endDateElement.value) {
            showElement(endDateError);
            datesValid = false;
        } else {
            hideElement(endDateError);
        }

        const startDate = new Date(startDateElement.value);
        const endDate = new Date(endDateElement.value);
        if (startDate >= endDate) {
            showElement(dateRangeError);
            datesValid = false;
        } else {
            hideElement(dateRangeError);
        }
    }

    return keywordsElement.value && (noDateCheckbox.checked || datesValid);
}

document.getElementById('noDateCheckbox').addEventListener('change', function() {
    if (this.checked) {
        const startDateElement = document.getElementById('startDate');
        const endDateElement = document.getElementById('endDate');
        
        if (startDateElement && endDateElement) {
            startDateElement.value = '';
            endDateElement.value = '';
        } 
    }
});

searchButton.onclick = () => {
    const allFieldsValid = performOnSearchValidations();

    if (allFieldsValid) {
        handleOnSearchState();
        const query = {
            keywords: keywordsElement.value,
            startDate: startDateElement.value,
            endDate: endDateElement.value,
            category: categoryElement.value
        }
        chrome.runtime.sendMessage({ event: 'searchButtonClicked', query});
    }
}

cancelButton.onclick = () => {
    handleOnCancelState();
    chrome.runtime.sendMessage({ event: 'cancelButtonClicked' });
}

chrome.storage.local.get(["keywords", "startDate", "endDate", "category", "isRunning"], (result) => {
    const { keywords, startDate, endDate, category, isRunning} = result;

    if (keywords) {
        keywordsElement.value = keywords;
    }
    if (startDate) {
        startDateElement.value = startDate;
    }
    if (endDate) {
        endDateElement.value = endDate;
    }
    if (category) {
        categoryElement.value = category;
    }

    if (isRunning) {
        handleOnSearchState();
    } else {
        handleOnCancelState();
    }
})

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.event === 'noResults') {
        showElement(noResultsSpan);
    } else if (message.event === 'resultsFound') {
        showElement(resultsButton);
        resultsButton.onclick = () => {
            chrome.runtime.sendMessage({event: 'openSidePanel', documents: message.documents});
            window.close();
        }
    }
});