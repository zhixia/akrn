'use strict';

var React = require('react-native');
var {
  View,
  SegmentedControlIOS,
  requireNativeComponent,
  Platform,
  Dimensions,
  StyleSheet
} = React;

var windowSize = Dimensions.get('window');

const TabComponent = Platform.OS === 'android' ? requireNativeComponent('AndroidTab') : SegmentedControlIOS;

var Tab = React.createClass({
	getDefaultProps: function() {
		return {
			tintColor:'#00c7b2',
			selectedIndex:0,
			values:['One', 'Two', 'Three', 'Four', 'Five'],
		};
	},
	onTabChange:function(e){
		const nativeValue = e && e.nativeEvent && e.nativeEvent.value || e
		this.props.onTabChange && this.props.onTabChange(nativeValue);
	},
	render:function() {
		return (
			<View style={{backgroundColor:'#fff'}}>
				<TabComponent onValueChange={(e) => this.onTabChange(e)} style={styles.tab} {...this.props}/>
			</View>
		)
	}
})

var styles = StyleSheet.create({
	tab:{
		width:windowSize.width-40,
		height:33,
		marginLeft:20,
		marginRight:20
	}
})

module.exports = Tab;
