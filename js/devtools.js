try {
    setTimeout(()=>{
        chrome.devtools.inspectedWindow.eval('__DYSTORE_DEVTOOLS__',res=>{
            if(res&&res.install){
                chrome.devtools.panels.create('dyStore', 'img/logo.png', 'dyStore.html', function(panel) {});
            }
        })
    },1000)
}catch (e) {}



