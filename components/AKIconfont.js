var React = require('react-native');
var {
	Platform
} = React;
var isIOS = Platform.OS == 'ios';
var YSPIconfont = React.requireNativeComponent(isIOS ?'YSPIconfont':'Iconfont',null);

var Iconfont = React.createClass({
	render:function(){
		if (isIOS) {
			return <YSPIconfont {...this.props}/>
		}
		var iconfontConfig = this.props.iconfontConfig;
		return <YSPIconfont style={this.props.style} color={iconfontConfig.color} bgColor={iconfontConfig.bgColor} fontSize={iconfontConfig.fontSize} iconCode={iconfontConfig.iconCode} />
	}
})

module.exports = Iconfont;