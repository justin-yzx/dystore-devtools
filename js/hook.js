let lastData={}
let pageTag=false

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type === 'getVue'){
        sendResponse(lastData)
    }
    if(message.type === 'query-store'){
        if(pageTag){
            chrome.runtime.sendMessage({type:'dystore-init'},function(res){})
            window.postMessage({type:'dystore-finish'},'*')
        }
    }
})


window.addEventListener("message", (event) => {
    if (event.source !=  window) {
        return;
    }
    if(event.data.type === 'dystore-init'){
        pageTag=true
        chrome.runtime.sendMessage(event.data,function(res){})
        window.postMessage({type:'dystore-finish'},'*')
    }
    if(event.data.type === 'store-change'){
        lastData = event.data
        chrome.runtime.sendMessage(event.data,function(res){})
    }
}, false);


