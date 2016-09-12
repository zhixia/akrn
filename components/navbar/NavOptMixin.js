var React = require('react-native');

var {
  AppRegistry,
  PropTypes,
  StyleSheet,
  TextInput,
  Text,
  View,
  Image,
  TouchableOpacity
} = React;

//var FoodList = React.createClass();

module.exports = {
	
	replaceRightBtnByName:function  (name,newIconfont,newTitle) {
		var btns = [].concat(this.state.buttons);
		for (var i = 0; i < btns.length; i++) {
			if (btns[i].name == name) {
				btns[i].iconfont = newIconfont;
			};
		};
		this.setState({
			buttons:btns
		})
	},
	setTitle:function  (t) {
		t && this.setState({
			title:t
		})
	}
}