/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/sidepanel.css":
/*!***************************!*\
  !*** ./src/sidepanel.css ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**************************!*\
  !*** ./src/sidepanel.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sidepanel_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sidepanel.css */ "./src/sidepanel.css");




chrome.storage.local.get(["documents"], (result) => {
  const documents = result.documents; 
  updateSidePanel(documents);
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.event === 'updateSidePanel') {
    updateSidePanel(message.documents);
  } 
});

function updateSidePanel(documents) {
  const container = document.getElementById('results-container');
  container.innerHTML = ''; // Clear previous results

  Object.values(documents).forEach(doc => {
    // Create section element
    const section = document.createElement('section');
    section.className = 'container m-1';

    // Create card div
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    // Create card-content div
    const cardContentDiv = document.createElement('div');
    cardContentDiv.className = 'card-content';

    // Create columns div
    const columnsDiv = document.createElement('div');
    columnsDiv.className = 'columns is-mobile';

    // Create image column
    const imageColumnDiv = document.createElement('div');
    imageColumnDiv.className = 'column is-one-third';

    // Create figure and img
    const figure = document.createElement('figure');
    figure.className = 'image is-9by16';
    const img = document.createElement('img');
    img.src = doc['imgSrc'];
    img.alt = doc['altText'];
    figure.appendChild(img);

    // Append figure to image column
    imageColumnDiv.appendChild(figure);

    // Create content column
    const contentColumnDiv = document.createElement('div');
    contentColumnDiv.className = 'column';

    // Add content to content column (p tags, a tag)
    const pHeading = document.createElement('p');
    pHeading.className = 'heading m-1 is-size-6-mobile';
    pHeading.textContent = doc['altText'];

    const pDate = document.createElement('p');
    pDate.className = 'date m-1 is-size-7-mobile';
    pDate.style.color = 'gray';
    pDate.textContent = `Date: ${doc['videoDate']}`;

    const aLink = document.createElement('a');
    aLink.href = doc['videoLink'];
    aLink.className = 'button is-link is-small m-1';
    aLink.textContent = 'View Video';
    aLink.addEventListener('click', function(event) {
      event.preventDefault(); 
      chrome.tabs.create({ url: this.href });
    });

    // Append elements to content column
    contentColumnDiv.appendChild(pHeading);
    contentColumnDiv.appendChild(pDate);
    contentColumnDiv.appendChild(aLink);

    // Append columns to card content
    columnsDiv.appendChild(imageColumnDiv);
    columnsDiv.appendChild(contentColumnDiv);

    // Append card content to card
    cardContentDiv.appendChild(columnsDiv);

    // Append card to section
    cardDiv.appendChild(cardContentDiv);
    section.appendChild(cardDiv);

    // Append section to container
    container.appendChild(section);
  });
}

/******/ })()
;
//# sourceMappingURL=sidepanel.js.map