function getCurrentTabId(callback)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        if(callback) callback(tabs.length ? tabs[0].id: null);
    });
}

function sendMessageToContentScript(message, callback)
{
    getCurrentTabId((tabId) =>
    {
        chrome.tabs.sendMessage(tabId, message, function(response)
        {
            if(callback) callback(response);
        });
    });
}
sendMessageToContentScript({type:'query-store'})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type === 'dystore-init'){
        chrome.devtools.panels.create('dyStore', 'img/logo.png', 'dyStore.html', function(panel) {});
    }
})
