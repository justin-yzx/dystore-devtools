let lastData={}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type === 'getVue'){
        sendResponse(lastData)
    }
})


window.addEventListener("message", (event) => {
    if (event.source != window) {
        return;
    }
    if(event.data.type === 'store-change'){
        lastData = event.data
        chrome.runtime.sendMessage(event.data,function(res){

        })
    }
}, false);


