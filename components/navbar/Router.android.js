'use strict';

var React = require('react-native');

var Navbar = require('./AKNavbar');
var NavbarWrapper = Navbar.NavbarWrapper;
var NarbarTransitional = Navbar.NarbarTransitional;
var sdk = require('../../lib/SDK');
var DA = require('../../lib/DA');
var Util = require('../../lib/Util');

var SceneContainer = require('./SceneContainer')
var CommponentLoading = require('./CommponentLoading');

var index = 0;
//var NavigatorNavigationBarStyles = require('NavigatorNavigationBarStyles');
var {
  StyleSheet,
  Text,
  Navigator,
  View,
  BackAndroid
} = React;

var self;
var Router = React.createClass({
  //mixins:[RouteMix],
  getInitialState: function(){
      DA.bundleUrl = this.props.bundleUrl;
      DA.query = Util.urlParam(this.props.bundleUrl);
      DA.uuid = DA.query.uuid || '';
      DA.model = DA.query.model || '';
      DA.navVer = this.props.iosVer || this.props.version;
      DA.rootTag = this.props.rootTag;
      return {};
  },
  getCmpMethods:function  () {
    return {
      push:this.push,
      pop:this.pop,
      replaceCurrent:this.replaceCurrent,
      router:this.getRouter
    } 
  },
  replaceCurrent:function  (opt) {
    var cfg = this.getComponentConfig(opt)
    var index = this.getRouter().state.routeStack.length -1;
    var c = DA.getSceneContainerByIndex(index);
    if (c) {
      c.setState(cfg)
    };
  },
  push:function  (opt) {
    this.refs.router.push(this.getComponentConfig({
      component:opt.component,
      passProps:opt.passProps
    }))
  },
  pop:function  () {
    if (this.refs.router.state.routeStack.length == 1) {
      BackAndroid.exitApp()
       //sdk.back(" ")
    }
    else{
       this.refs.router.pop();
    }
     
  },
  getComponentConfig:function  (opt) {
    return {
      component:SceneContainer,
      title:'',
      name:opt.component.disaplyName,
      passProps:{
        router:this.getRouter,
        component:opt.component,
        passProps:opt.passProps,
        routerMethods:this.getCmpMethods()
      }
    }
  },
  getRouter:function  () {
    return this.refs.router;
  },
  componentDidMount: function() {
    DA.registeRouter(this.getCmpMethods());
    var router = this.getRouter();
    router.navigationContext.addListener('didfocus', function(e){
      var index =router.state.routeStack.indexOf(e.data.route) ;
      var c = DA.getSceneContainerByIndex(index);
      if (c) {c.didFocus(e.data.params)};
    });
    var self = this;
    setTimeout(function(){
      self.replaceCurrent({
        component: self.props.component
      });
      
    }, 0);
    BackAndroid && BackAndroid.addEventListener('hardwareBackPress', this.goBack);
  },
  goBack:function(){
    var stack = this.refs.router.state.routeStack;
    var index = stack.length -1;
    if (index >=0) {
      var c = DA.getSceneContainerByIndex(index);
      if (c) {
        var content = c.getContent();
        if (content.hardwareBackPress) {
          return content.hardwareBackPress()
        }else{
          this.pop()
        }
      };
    };
    return true;
  },
  renderScene:function(route,nav){
    var component = route.component;
    return (<route.component {...route.passProps} />);
  },
  render: function() {
    
    var route = this.getComponentConfig({
        component: CommponentLoading
      });
    route.index =0 ;
    return (
      <Navigator
        ref={'router'}
        configureScene={(route) => {
          console.log('route.sceneConfig', route.sceneConfig);
          if (route.sceneConfig) return route.sceneConfig;
          // return Navigator.SceneConfigs.FloatFromRight;
          return Navigator.SceneConfigs.FadeAndroid;
        }}  
        initialRoute={route}
        renderScene={this.renderScene}
        />)
  }
});



module.exports = Router;