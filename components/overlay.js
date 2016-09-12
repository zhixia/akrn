var React = require('react-native');

var {
  Dimensions,
  StyleSheet,
  Component,
  TouchableWithoutFeedback,
  View
} = React;

var window = Dimensions.get('window');

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  overlay: {
    position: 'absolute',
    // backgroundColor: 'transparent',
    backgroundColor: '#000',
    opacity: 0.3,
    width: window.width,
    height: window.height
  }
});

var Overlay = React.createClass({
  propTypes:{
    pageX: React.PropTypes.number,
    pageY: React.PropTypes.number,
    show: React.PropTypes.bool
  },
  getDefaultProps: function() {
      return {
        pageX: 0,
        pageY: 0,
        show: false
      };
  },
  render() {
    var { pageX, pageY, show, onPress } = this.props;

    if (!show) {
      return null
    }

    return (
      <TouchableWithoutFeedback style={styles.container} onPress={onPress}>
        <View style={[styles.overlay, { top: -pageY, left: -pageX },this.props.overlayStyle]}/>
      </TouchableWithoutFeedback>
    );
  }
});
module.exports = Overlay;
