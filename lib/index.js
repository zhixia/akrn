var DA        = require('./DA');
var SDK       = require('./SDK');
var util      = require('./Util');
var Router    = require('../components/navbar/Router')
var RouterAD  = require('../components/navbar/Router.android')
var React     = require('react-native');
var wv        = require('./windvane');
var DeviceData = require('./DeviceData');

var {
 Platform
} = React;

module.exports = {
	DA:DA,
	SDK:SDK,
	Util:util,
	Router:Router,
	RouterAndroid:RouterAD,
	Windvane:wv,
	bridge:wv,
	DeviceData:DeviceData,
	getRouter: function(){
		if (Platform.OS === 'ios') {
			return Router
		}
		return RouterAD
	},
	
}
