var React = require('react-native');
var {
    DeviceEventEmitter,
    NativeModules
} = React;
var Util = require('../lib/Util');
var DA = require('../lib/DA');
DA.subUUIDs = [];
var sdk = require('../lib/SDK');
var cacheData = {};

var sceneMap = {};
var bindGuid = -1; // 绑定的序列号
var _put = function(guid, name, value) {
    sceneMap[name] = sceneMap[name] || {};
    sceneMap[name][guid] = value;
}
var _get = function(name) {
    return sceneMap[name];
}
var _remove = function(guid, method){
    if(sceneMap[method]){
        if(sceneMap[method][guid]){
            delete sceneMap[method][guid];
            return true;
        }
    }
    return false;
}

var DeviceData = {
    init: function(){
        var self = this;
        console.log('DeviceData init');
         DeviceEventEmitter.addListener(
        'downStream',function(event){
            var e = typeof event == 'string' ? JSON.parse(event) : event;
            var method = e.method,
                params = e.params;
            // 删除此可能引起报错的代码
            // if(params.uuid){
            //                 console.log('method', method, 'uuid', params.uuid);
            // }else if(params[0].uuid){
            //     console.log('method', method, 'uuid', params[0].uuid);
            // }
            if(!DA.uuid)return;
            if (method == 'attachSubDevice') { // 子设备插上
                if (params.uuid == DA.uuid) {
                    params.clients.forEach(function(u) {
                        //需要设备页面先初始化DA.subUUIDs
                        DA.subUUIDs.push(u);
                    });
                    self.sendApp(method, params);
                }
                return;
            }

            // 数据状态变化
            if (method == 'deviceStatusChange' || method == 'deviceStatusChangeArray') {

                if (params instanceof Array == true) { //deviceStatusChangeArray为数据
                    params = params[0];
                }

                if (DA.uuid == params.uuid) {
                    console.log('指令上报 - deviceStatusChange:', params, JSON.stringify(params));
                    self._saveDeviceData(params, function(data){
                        self.sendApp('deviceStatusChange', data);
                    });
                    return;
                }
                return;
            }
            // 其他数据有推送
            if(DA.uuid == params.uuid){
                self.sendApp(method, params);
                return;
            }

        });
     },
     // 保存设备数据
     _saveDeviceData: function(data, cb){
        var isStatusOff = data.onlineState, self = this;
        // isStatusOff = isStatusOff ? isStatusOff.value === 'off' : false;
        if (!cacheData.onlineState) {
            self.getDeviceData(function(data){
                cacheData = Object.assign(cacheData, data);
                if(cacheData.onlineState){
                    cb && cb(cacheData);
                }
            });
        } else {
            cacheData = Object.assign(cacheData, data);
            if(cacheData.onlineState){ 
                cb && cb(cacheData);
            }
        }
     },
     sendApp: function(method, data) {
        var methodObjs = _get(method);
        if(!methodObjs){
            return;
        }

        Object.keys(methodObjs).forEach(function(key) {
          var func = methodObjs[key];
          if(Util.isFunction(func)){
            func(data);
          }
        });
    },
     bindPushData: function(obj){
        var guid = ++bindGuid;
        Object.keys(obj).forEach(function(key) {
          var value = obj[key];
          if(Util.isFunction(value)){
            _put(guid, key, value);
          }
        });
        return bindGuid;
     },
     // 移除绑定
     removeBind: function(guid, method){
        _remove(guid, method)
     },
     getCurrentDeviceData: function(){
        return cacheData;
     },
     refreshDeviceData: function(callback){
        var self = this;
        self.getDeviceData(function(data){
            self._saveDeviceData(data, function(data){
                console.log('refreshDeviceData', data);
                callback && callback(data);
            });
        })
    },
    getDeviceData: function(cb){
        NativeModules.AKRNSDK && NativeModules.AKRNSDK.registerUuid(DA.uuid);
        DA.onReady(function(DA){
            sdk.call({
                method:'getDeviceStatus',
                params:{
                  "uuid": DA.uuid
                }
            }, function(data){
                res = Util.processResponse(data);
                console.log('getDeviceData', res);
                if(res.code == 1000){
                    cb && cb(res.data);
                }
            })
        });
    },
    setDeviceData:function(uuid,data,cb){
        uuid = uuid || DA.uuid;
        if (!uuid) {
            console.error('uuid不存在');
            return;
        }
        var attrSet = [];
        for (var key in data) {
            attrSet.push(key);
        }
        data['attrSet'] = attrSet;
        data.uuid = uuid;

        var opt = {
            method: 'setDeviceStatus',
            params: data
        };

        sdk.call(opt, function(res){
            res = Util.processResponse(res);
            if (res.code == 1000) {
                cb && cb(true, res);
                return;
            }

            if (res.msg === 'no bind relation') {
                DA.cmp.toast({
                  duration:3000,
                  content:'很抱歉，您的设备已经被解绑，请您重新绑定',
                  isVisible:true
                 })
                cb && cb(false, res);
                return;
            }

            DA.cmp.toast({
              duration:3000,
              content:'指令下发失败',
              isVisible:true
             })
            cb && cb(false, res);

        })       
    }
}
DeviceData.init();

module.exports = DeviceData;