'use strict';

var React = require('react-native');

var Navbar = require('./AKNavbar');
var NavbarWrapper = Navbar.NavbarWrapper;
var NarbarTransitional = Navbar.NarbarTransitional;
var sdk = require('../../lib/SDK');
var RouteMix = require('./RouteMix')
//var NavigatorNavigationBarStyles = require('NavigatorNavigationBarStyles');
var {
  StyleSheet,
  Navigator,
  Text,
  View,
} = React;

var self;
var Router = React.createClass({
  mixins:[RouteMix],
  getInitialState: function() {
    self = this;
    return {
      route: null,
      dragStartX: null,
      didSwitchView: null,
    };
  },
  componentWillMount:function  () {
    this._itemRefs = {};
  },
  /*
   * This changes the title in the navigation bar
   * It should preferrably be called for "onWillFocus" instad >
   * > but a recent update to React Native seems to break the animation
   */
  onDidFocus: function(route) {
    this.setState({ route: route });
    this.onViewActive && this.onViewActive(route)
  },

  onBack: function(navigator) {
    if (this.state.route.index > 0) {
      this.state.route.index--;
      navigator.pop();
    }else{
      sdk.back(" ")
    }
  },

  onForward: function(route, navigator) {
    route.index = this.state.route.index + 1 || 1;
    navigator.push(route);
  },

  onFirst: function(navigator) {
    navigator.popToTop();
  },
  onNavBtnPress:function  (nav,btnName) {
    if (nav.props._navKey) {
      var index = nav.props._navKey.replace('_nav','');
      if (this._itemRefs['_content'+index] && this._itemRefs['_content'+index].onNavBtnPress) {
        this._itemRefs['_content'+index].onNavBtnPress(nav,btnName,this);
      };
    };
  },
  _getNavbarView:function  (component) {
    if (this._itemRefs[component.props._contentKey]) {
      var key = component.props._contentKey.replace('_content','');
      var nav =  this._itemRefs['_nav'+key];
      if (nav) {
        return nav;
      }
    };
    return null;
  },
  renderScene: function(route, navigator) {
    this._route = route;
    this._navigator = navigator;
    var goForward = function(route) {
      if (route.component.sceneConfig) {
        route.sceneConfig = route.component.sceneConfig
      };
      route.index = this.state.route.index + 1 || 1;
      navigator.push(route);
    }.bind(this);

    var goBackwards = function() {
      this.onBack(navigator);
    }.bind(this);

    var goToFirstRoute = function() {
      navigator.popToTop();
    };

    var didStartDrag = function(evt) {
      var x = evt.nativeEvent.pageX;
      if (x < 28) {
        this.setState({
          dragStartX: x,
          didSwitchView: false
        });
        return true;
      }
    }.bind(this);

    // Recognize swipe back gesture for navigation
    var didMoveFinger = function(evt) {
      var draggedAway = ((evt.nativeEvent.pageX - this.state.dragStartX) > 30);
      if (!this.state.didSwitchView && draggedAway) {
        this.onBack(navigator);
        this.setState({ didSwitchView: true });
      }
    }.bind(this);

    // Set to false to prevent iOS from hijacking the responder
    var preventDefault = function(evt) {
      return true;
    };

    var updateNavbarProps = function(props) {
      route.updateNavbarProps && route.updateNavbarProps(props);
      route.updateStaticNavbarProps && route.updateStaticNavbarProps(props);
    }
    var self = this;
    var Content = route.component;
    var navbarPassProps;
    var Nav ;
    var Navbar = NavbarWrapper;
    if (Content.navbarPassProps) {
      navbarPassProps = Content.navbarPassProps;
      if (navbarPassProps.barType == 'transitional') {
        Navbar = NarbarTransitional;
      };
      
    }
    route.passProps = route.passProps || {}
    if (navbarPassProps) {
      route.passProps.getNavbarView = this._getNavbarView;
      navbarPassProps._navKey = '_nav'+route.index;
      navbarPassProps.onNavBtnPress = this.onNavBtnPress;
      Nav = <Navbar  {...navbarPassProps} {...route.passProps.navbarPassProps} ref={function(nav){
        if (!nav || !nav.props._navKey) {return};
        self._itemRefs[nav.props._navKey] =  nav;
      }}/>
    };
    
    return (
      <View

        style={[styles.container]}
        onStartShouldSetResponder={didStartDrag}
        onResponderMove={didMoveFinger}
        onResponderTerminationRequest={preventDefault}>
        
        <Content
          ref={function(component){
            if (!component || !component.props._contentKey) {return};
            self._itemRefs[component.props._contentKey] =  component;
          }}
          _contentKey={'_content'+route.index}
          route={{
            index:route.index,
            push:goForward,
            pop:goBackwards,
            popToTop:goToFirstRoute,
            navigator:navigator
          }}
          updateBarBackgroundStyle={
            (style)=>{
              route.updateBarBackgroundStyle &&
                route.updateBarBackgroundStyle(style)
            }
          }
          updateNavbarProps={updateNavbarProps}
          {...route.passProps}/>
          {Nav}
      </View>
    )

  },

  render: function() {

    
   

    var initialRoute = this.props.initialRoute;
    initialRoute.index = 0;
    return (
      <Navigator

        configureScene={(route) => {
          if (route.sceneConfig) return route.sceneConfig;
          return Navigator.SceneConfigs.FloatFromRight;
        }}  
        initialRoute={initialRoute}
        //navigationBar={navigationBar}
        renderScene={this.renderScene}
        onDidFocus={this.onDidFocus}/>)
  },
});


var styles = StyleSheet.create({
  container: {
    flex: 1
  },
});


module.exports = Router;