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
  NavigatorIOS,
  View,
} = React;

var self;

var Router = React.createClass({
  //mixins:[RouteMix],
  getInitialState: function(){
      DA.bundleUrl = this.props.bundleUrl;
      DA.query = Util.urlParam(this.props.bundleUrl);
      DA.uuid = DA.query.uuid || '';
      DA.model = DA.query.model || '';
      DA.navVer = this.props.iosVer || this.props.androidVer;
      DA.rootTag = this.props.rootTag;
      return {
      };
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
    this.refs.router.navigator.push(this.getComponentConfig({
      component:opt.component,
      passProps:opt.passProps
    }))
  },
  pop:function  () {
    if (this.refs.router.state.idStack.length == 1) {
       DA.back('popRn');
    }
    else{
       this.refs.router.pop();
    }
     
  },
  getComponentConfig:function  (opt) {
    return {
      component:SceneContainer,
      title:'',
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
  componentWillMount: function(){
  },
  componentDidMount: function() {
    DA.registeRouter(this.getCmpMethods());
    var router = this.getRouter();
    this.overriteRouterMethod()
    router.navigator.navigationContext.addListener('didfocus', function(e){
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
    
  },
  render: function() {
    var component = this.props.component;
    var route = this.getComponentConfig({
        component: CommponentLoading
      });
    return (
      <NavigatorIOS ref="router" navigationBarHidden={true} style={{flex:1}}
        initialRoute={route}
      />
        )
  },
  overriteRouterMethod:function  () {
    var router = this.getRouter();
    router._handleNavigatorStackChanged = _handleNavigatorStackChanged.bind(router)
    router._emitDidFocus = _emitDidFocus.bind(router);
  }
});

//用于h5返回参数
var _emitDidFocus=  function(route: Route,p) {
    this.navigationContext.emit('didfocus', {route: route,params:p});
  };
var _handleNavigatorStackChanged = function(e: Event) {
  console.log('_handleNavigatorStackChanged',e);
    var newObservedTopOfStack = e.nativeEvent.stackLength - 1;
    this._emitDidFocus(this.state.routeStack[newObservedTopOfStack],e.nativeEvent.params);

    // invariant(
    //   newObservedTopOfStack <= this.state.requestedTopOfStack,
    //   'No navigator item should be pushed without JS knowing about it %s %s', newObservedTopOfStack, this.state.requestedTopOfStack
    // );
    var wasWaitingForConfirmation =
      this.state.requestedTopOfStack !== this.state.observedTopOfStack;
    // if (wasWaitingForConfirmation) {
    //   invariant(
    //     newObservedTopOfStack === this.state.requestedTopOfStack,
    //     'If waiting for observedTopOfStack to reach requestedTopOfStack, ' +
    //     'the only valid observedTopOfStack should be requestedTopOfStack.'
    //   );
    // }
    // Mark the most recent observation regardless of if we can lock the
    // navigator. `observedTopOfStack` merely represents what we've observed
    // and this first `setState` is only executed to update debugging
    // overlays/navigation bar.
    // Also reset progress, toIndex, and fromIndex as they might not end
    // in the correct states for a two possible reasons:
    // Progress isn't always 0 or 1 at the end, the system rounds
    // If the Navigator is offscreen these values won't be updated
    // TOOD: Revisit this decision when no longer relying on native navigator.
    var nextState = {
      observedTopOfStack: newObservedTopOfStack,
      makingNavigatorRequest: false,
      updatingAllIndicesAtOrBeyond: null,
      progress: 1,
      toIndex: newObservedTopOfStack,
      fromIndex: newObservedTopOfStack,
    };
    this.setState(nextState, this._eliminateUnneededChildren);
};



module.exports = Router;