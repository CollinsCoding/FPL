 function onInstall() {
    console.log("Extension Installed");
  }

  function onUpdate() {
    console.log("Extension Updated");
  }

var tablink;

chrome.pageAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({ 'url': 'FPLLeagueStats.html', 'selected': true }, function (tab) {
    });
});

// Sets page action requirement
function checkForValidUrl(tabId, changeInfo, tab) {
    if (tab.url.indexOf("fantasy.premierleague.com/my-leagues/") > -1 && tab.url.indexOf("standings") > -1) {
        chrome.pageAction.show(tabId);
        tablink = tab.url;
		
    }
};

// Checks for URL change
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// Gets URL and sends
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      sendResponse(tablink);
  });