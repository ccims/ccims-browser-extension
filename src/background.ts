browser.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  if (details.url.includes("github")) {
    browser.tabs.executeScript({ file: "js/git-hub-content-script.js" });
  }
});

browser.webNavigation.onCompleted.addListener(function(details) {
  if (details.url.includes("github")) {
    browser.tabs.executeScript({ file: "js/git-hub-content-script.js" });
  }
});
