chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // pokazujemy ikonkę na żądanie userscripta
    if (request.showBackgroundIcon) {
        chrome.pageAction.show(sender.tab.id);
    } else {
        console.error('background.js: unkown request', request);
    }
});