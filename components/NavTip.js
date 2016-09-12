//导航条下方的 黑色提示层

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  PropTypes,
  StyleSheet,
  Dimensions,
  requireNativeComponent,
  TouchableOpacity,
  Platform
} = React;
var window = Dimensions.get('window');
var TimerMixin = require('react-timer-mixin');

var NavTip = React.createClass({
  mixins:[TimerMixin],
  propTypes: {
    /**
     * Determines the visibility of the Overlay. When it is not visible,
     * an empty View is rendered.
     */
    isVisible: React.PropTypes.bool,
  },

  getInitialState: function () {
    return {
      isVisible: false,
      overlayCanClose: true,
      content: '',
      duration:null
    }
  },
  _onOverlayPress(){
    if(this.state.overlayCanClose){
      this.setState({
        isVisible: false,
        overlayCanClose: true,
        content: ''
      });
    }  
  },
  onPress(){
    if (this.state.onPress) {
      this.state.onPress()
    };
  },
  render() {
    var {
      isVisible,
    } = this.props;
    if (this.state.isVisible  ) {
      var self = this;
      this.state.duration != null && this.setTimeout(function(){
        self.setState({
          isVisible:false,
          duration:null
        })
      },this.state.duration)
      return (
        <TouchableOpacity onPress={this.onPress} style={styles.container}>
        <View >
            <Text style={styles.content}>{this.state.content}</Text>
        </View>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  },
});


var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS =='ios' ? 64:46,
    height:44,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent:'center',
    alignItems:'center'
  },
  
  content: {
    color: '#fff',
    fontWeight: "800",
    textAlign: 'center',
    justifyContent:'center',
    fontSize: 13,
    backgroundColor: 'transparent'
  }
})

module.exports = NavTip;
