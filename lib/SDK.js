var React = require('react-native');
var WindVaneBridge = require('./windvane');
var { 
  NativeModules,
  DeviceEventEmitter,
  Platform
 } = React;
 var request = {
    request:{
        "token": "", //由native 补全
        "host": "com.aliyun.alink",
        "hostType": "app",
        "version": "1.0.0", //由native 补全
        "target": "",
        "account": ""
    }
    
};

// var DA = require('./DA');


 var exportOpt = {
    call: function(opt,cb, className, methodName){
        className = className || 'AlinkRequest';
        methodName = methodName || 'wsfProxy';
        // WindVaneBridge.call('AlinkRequest','wsfProxy',opt,cb)
        // return;
        if (Platform.OS  == 'ios') {
            // var p = Object.assign(opt,request);
            WindVaneBridge.call(className,methodName,opt,function(a){
                console.log('wsf 入参:',opt);
                console.log('wsf 响应',a);
                cb(a)
            },function(a){
                console.log('wsf 入参:',opt);
                console.log('wsf 响应',a);
                cb(a)
            })
        }else{
          WindVaneBridge.call(className, methodName, opt, cb,cb);
        }
    },
    callP:function  (opt) {
        return new Promise(function(resolve,reject){
            exportOpt.call(opt,function(resp){
                resolve(resp)
            })
        })
    },
    push: function(url){
        NativeModules.AKRNSDKModule.push(url);
    } 
 }
 module.exports = exportOpt