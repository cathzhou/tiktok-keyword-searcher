'use strict';

chrome.runtime.onMessage.addListener(data => {
  const { event, query } = data;
  switch (event) {
      case 'searchButtonClicked':
          handleOnSearch(query);
          break;
      case 'cancelButtonClicked':
          handleOnCancel();
          break;
      default:
          break;
  }

})

const handleOnSearch = (query) => {
  console.log("Search button clicked in background");
  console.log("Query recieved:", query);
  setRunningStatus(true);
  chrome.storage.local.set({query: query});
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {event: 'searchButtonClicked', query: query});
  });
}

const setRunningStatus = (isRunning) => {
  chrome.storage.local.set({ isRunning })
}

const handleOnCancel = () => {
  console.log("Cancel button clicked in background");
  setRunningStatus(false);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.event === "openSidePanel") {
    console.log("Side panel content update");
    console.log("Documents:", request.documents)
    chrome.storage.local.set({documents: request.documents})
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.sidePanel.open({ tabId: tabs[0].id });
      chrome.sidePanel.setOptions({
          tabId: tabs[0].id,
          path: 'sidepanel.html',
          enabled: true
      });
    });
    setRunningStatus(false);
    chrome.runtime.sendMessage({event: 'updateSidePanel', documents: request.documents});
  }
});