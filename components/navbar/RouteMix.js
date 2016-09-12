var React = require('react-native');
var WindVaneBridge = React.NativeModules.WindVaneBridge;


module.exports = {
	onViewActive:function  (route) {
		WindVaneBridge.call('AlinkHybrid','toggleSwipeBack',{
			enable:route.index == 0?'1':'0'
		},function(){
		},function(){
		})
	}
};