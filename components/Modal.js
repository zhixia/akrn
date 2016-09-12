'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  NavigatorIOS,
  View,
} = React;
var Overlay = require('./overlay');

var Modal = React.createClass({
	getDefaultProps: function() {
		return {
			content:null,
			hide:true,
			maskTapHide:true
		};
	},
	getInitialState: function() {
		return {
			content:this.props.content ,
			hide:this.props.hide,
			maskTapHide:this.props.maskTapHide
		};
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			content:nextProps.content,
			containerStyle:nextProps.containerStyle,
			hide:nextProps.hide,
			maskTapHide:nextProps.maskTapHide
		})
	},
	_onOverlayPress:function  () {
		this.state.maskTapHide && this.setState({hide:true})	
	},
	render:function  () {
		if (this.state.hide) {return null};
		return (<View style={[styles.container,this.state.containerStyle]}>
				<Overlay
		            pageX={0}
		            pageY={0}
		            overlayStyle={this.state.overlayStyle}
		            show={true}
		            onPress={ this._onOverlayPress }
	            />
				{this.state.content}
			   </View>)
	}
});
var styles = StyleSheet.create({
	container:{
		position:'absolute',
		top:0,left:0,right:0,bottom:0,
		backgroundColor: 'transparent'
	}
})
module.exports = Modal