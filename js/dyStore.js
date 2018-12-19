let app = null
if(!app){
    console.log('init')
    Vue.component('dy-tree', {
        name:'dy-tree',
        props:['treeData', 'tier'],
        template: `
            <div class="tree-list" :style="{marginLeft:tier*10+'px'}">
                <div v-for="(value,key) in treeData" :key="key">
                    <div class="title" @click="changeFlag(key)">
                        <span class="arrow" :class="showTag[key]?'rotate':''" v-if="getType(value)!=='else'"></span>
                        <span class="title-key">{{key}}</span>
                        <span>：</span>
                        <span class="title-type"  v-if="getType(value)==='obj'">Object</span>
                        <span class="title-type"  v-if="getType(value)==='arr'">Array</span>
                        <span class="title-value" v-if="getType(value)==='else'">
                            <span class="title-string" v-if="getAccurateType(value)==='string'&&value!=='undefined'">"<span>{{value}}</span>"</span>
                            <span class="title-boolean" v-if="getAccurateType(value)==='boolean'">{{value}}</span>
                            <span class="title-number" v-if="getAccurateType(value)==='number'">{{value}}</span>
                            <span class="title-undefined" v-if="getAccurateType(value)==='string'&&value==='undefined'">undefined</span>
                            <span class="title-null" v-if="getAccurateType(value)==='null'">null</span>
                        </span>
                    </div>
                    <div class="children" v-if="showTag[key]">
                        <div v-if="getType(value)==='obj'||getType(value)==='arr'" >
                            <dy-tree :tree-data="value" :tier="tier+1"></dy-tree>
                        </div>
                    </div>
                </div>
            </div>`,
        methods:{
            getType(obj){
                if(typeof obj === 'object'){
                    if(Object.prototype.toString.call(obj)==='[object Object]'){
                        return 'obj'
                    }else if(Object.prototype.toString.call(obj)==='[object Array]') {
                        return 'arr'
                    }else {
                        return 'else'
                    }
                }else {
                    return 'else'
                }
            },
            getAccurateType(obj){
                if(typeof obj === 'string'){
                    return 'string'
                }
                if(typeof obj === 'boolean'){
                    return 'boolean'
                }
                if(typeof obj === 'number'){
                    return 'number'
                }
                if(typeof obj === 'undefined'){
                    return 'undefined'
                }
                if(obj === null){
                    return 'null'
                }
                return 'string'
            },
            changeFlag(key){
                this.$set(this.showTag,key,!this.showTag[key])
            }
        },
        data(){
            return{
                showTag:{}
            }
        },
        watch:{
            treeData:{
                deep:true,
                handler(){
                    let keys=Object.keys(this.treeData)
                    let newTag={}
                    keys.forEach(key=>{
                        if(typeof this.showTag[key] !== 'boolean') {
                            newTag[key]=false
                        }else {
                            newTag[key]=this.showTag[key]
                        }
                    })
                    this.showTag=newTag
                }
            }
        }
    })
    app=new Vue({
            el: '#app',
            data:{
                store:{},
            }
        }
    )
}

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

sendMessageToContentScript({type:'getVue'}, (response) => {
    if(response){
        if(app&&response.type=="store-change"){
            app.store=JSON.parse(response.msg);
        }
    }
});



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.type === 'store-change'){
        if(app){
            app.store=JSON.parse(message.msg);
        }
    }
})

