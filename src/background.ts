/**
 * Execute GitHub content-script when history state updates.
 */
browser.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  if (details.url.includes("github")) {
    browser.tabs.executeScript({ file: "js/git-hub-content-script.js" });
  }
});

/**
 * Execute GitHub content-script on webNavigation completed.
 */
browser.webNavigation.onCompleted.addListener(function(details) {
  if (details.url.includes("github")) {
    browser.tabs.executeScript({ file: "js/git-hub-content-script.js" });
  }
});
