'use strict';

var React = require('react-native');
var DA = require('../../lib/DA');

var {
  StyleSheet,
  Text,
  NavigatorIOS,
  View,
  Platform
} = React;
var sourceImage = DA.Resource;

var CommponentLoadingView = React.createClass({
    statics: {
    navbarPassProps: {
      statusBarColor: 'black',
      buttons: [],
      title: ''
    }
  },
    onNavBtnPress: function (nav, btnName, route) {
        DA.back('popRn');
    },
    render: function(){
        
        return (
            <View style={styles.container}>
                {Platform.OS=='android'?null:sourceImage.loading_gif(50, 50)}
            </View>
        );
    }
});
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});


module.exports = CommponentLoadingView;