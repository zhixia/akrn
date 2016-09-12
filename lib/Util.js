var Util = {
    processResponse: function(responseData){
        if (typeof responseData ==='string') {
            responseData = JSON.parse(responseData);
        };
        if(!responseData){
          return {code: 1001, data: "服务器出了点问题，稍后重试"};
        }
        if(!responseData.result){
          return {code: 1001, data: responseData.msg}; 
        }
        if(responseData.result.msg == 'success'){
            if(responseData.result.data){
                return {code: 1000, data: responseData.result.data};
            }else{
                return {code: 1001, data: '服务器出了点问题，稍后重试'};
            }
        }
        return {code: 1001, data: responseData.result.msg};
    },
    isFunction: function(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    },
    param:function (obj) {  
        return obj ? Object.keys(obj).map(function (key) {  
            var val = obj[key];  
  
            if (Array.isArray(val)) {  
                return val.map(function (val2) {  
                    return encodeURIComponent(key) + '=' + encodeURIComponent(val2);  
                }).join('&');  
            }  
  
            return encodeURIComponent(key) + '=' + encodeURIComponent(val);  
        }).join('&') : '';  
    },
    urlParam: function(url) {
        if(!url){
          return {};
        }
        var url = url; //获取url中"?"符后的字串
        url = url.split('#');
        url = url[0];

        var theRequest = {};
        if (url.indexOf("?") != -1) {
            var query = url.split('?');
            var str = '';
            for(var urlindex = 1; urlindex < query.length; urlindex++){
                str += query[urlindex];
            }
            // var str = query[1];
            // console.log(str);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                var key = strs[i].split("=");
                if(key.length == 2){
                    theRequest[key[0]] = decodeURI(key[1]);
                }
            }
        }
        return theRequest;

       //  // var str = "http://www.bi.com/path?Www=222&bb=dcc?aa=ce";
       //  if (typeof str !== 'string') {
       //      return {};
       //  }
       //  var urls = str.split('?');
       //  var urlParam = {};
       //  urls.forEach(function(item, idx){
       //      var itemParamStr = item.trim().replace(/^(\?|#|&)/, '');
       //      if(itemParamStr){
       //          var itemParam = itemParamStr.split('&').reduce(function (ret, param) {
       //              var parts = param.replace(/\+/g, ' ').split('=');
       //              var key = parts[0];
       //              var val = parts[1];

       //              key = decodeURIComponent(key);
       //              // missing `=` should be `null`:
       //              // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
       //              val = val === undefined ? null : decodeURIComponent(val);
       //              if(!val){
       //                  return null;
       //              }
       //              if (!ret.hasOwnProperty(key)) {
       //                  ret[key] = val;
       //              } else if (Array.isArray(ret[key])) {
       //                  ret[key].push(val);
       //              } else {
       //                  ret[key] = [ret[key], val];
       //              }

       //              return ret;
       //          }, {});
       //          if(itemParam){
       //              urlParam = Object.assign(urlParam, itemParam);
       //          }
       //      }
       //  })
       // return urlParam;
    },
    str:{
        format : function() {
            var args = arguments;
            var str = Array.prototype.shift.apply(args);
            if (typeof str !== 'string') {return};
            return str.replace(/{(\d+)}/g, function(match, number) { 
              return typeof args[number] != 'undefined'
                ? args[number]
                : match
              ;
            });
        }  
    }
}

module.exports = Util;