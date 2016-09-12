'use strict';

var React = require('react-native');


//var NavigatorNavigationBarStyles = require('NavigatorNavigationBarStylesIOS');
var Iconfont = require('../AKIconfont');
var TimerMixin = require('react-timer-mixin');

var {
  StyleSheet,
  View,
  StatusBarIOS,
  Text,
  TouchableOpacity,
  NavigatorNavigationBarStylesIOS,
  Dimensions,
  Platform
} = React;
//var window = Dimensions.get('window');


var NavbarWrapper = React.createClass({
  //mixins: [TimerMixin],
  getInitialState() {
    return Object.assign({
      barStyle:{},
      disableNames:[]
    },this.props);
  },
  getDefaultProps:function  () {
    return {
      buttons:[],
      backBtnStyle: {
        opacity: 1
      }
    }
  },
  componentWillMount() {
    this.setState({
      style: this.props.style
    });
  },

  componentWillReceiveProps(newProps) {
    if (newProps.style !== this.props.style) {
      this.setState({
        style: newProps.style
      });
    }
  },
  onBtnPress:function  (name) {
    if (this.state.disableNames.indexOf(name) != -1) {return};
    this.props.onNavBtnPress(this,name);
    var buttons = this.state.buttons;
    var newButtons ;
    for (var i = 0; i < buttons.length; i++) {
      var item = buttons[i];
      var text = item.name;
      if (Array.isArray(item.text) && item.name == name) {
          item.text.reverse();
          buttons[i] = item; 
          newButtons = buttons;
          break;
      };
    };
    if (newButtons) {
      this.setState({buttons:newButtons});
    };
  },
  setBarStyle:function  (style) {
    this.setState({
      barStyle:style
    });
    //this.setTimeout(this.forceUpdate, 0);
  },
  
  _stateFromProps:function  () {
    return this.props; 
  }, 
  render() {
   var self = this;  
   // Status bar color
    if (StatusBarIOS) {
      if (this.props.statusBarColor === "black") {
        StatusBarIOS.setStyle(0);
      } else {
        StatusBarIOS.setStyle(1);
      }
    };
   return (<View style={[styles.container,this.props.style,this.state.barStyle]}>
      <View style={[styles.backBtn, this.props.backBtnStyle]}>
        <TouchableOpacity onPress={function(){self.onBtnPress('back')}}>
          <View style={styles.backBtnInner}>
            <Iconfont style={styles.iconfont} iconfontConfig={{color:'#00c7b2',bgColor:'transparent',fontSize:20,iconCode:'&#x3054'}} />
            <Text style={[styles.navBtn]}>{'返回'}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Title title={this.props.title} ref="title" />
      <View style={[styles.navBtnCt]}>
        {this.state.buttons && this.state.buttons.map(function(item,index){
            return (<View style={styles.rightBtnInner} key={index}>
              <TouchableOpacity    onPress={function(){self.onBtnPress(item.name)}}>
                {self.createRightBtns(item,index)}
              </TouchableOpacity>
              </View>
              )     
        })}
      </View>
    </View>)
  },
  setTitle:function(title){
    this.refs.title.setState({
      title:title
    })
  },
  createRightBtns:function  (item) {
    if (item.text) {
      return this.creatTextRightBtn(item)
    }else if(item.iconfont){
      var opacity = this.state.disableNames.indexOf(item.name) != -1 ? .5 : 1;
      return <Iconfont  style={[styles.iconfont,styles.rightBtn,{opacity:opacity}]} iconfontConfig={{color:'#00c7b2',bgColor:'transparent',fontSize:20,iconCode:item.iconfont}} /> 
    }
    
  },
  creatTextRightBtn:function  (item) {
    var opacity = this.state.disableNames.indexOf(item.name) != -1 ? .5 : 1;
    var text = item.text;
    if (Array.isArray(item.text)) {
      text = item.text[0];
    };
    return <View style={styles.rightBtnTextCt}><Text style={[styles.navBtn,styles.rightBtn,{opacity:opacity}]}>{text}</Text></View>
  },
  disableRightBtnByName:function(name,isDisable){

      if (isDisable === true && this.state.disableNames.indexOf(name) == -1)  {
        var names = this.state.disableNames.concat([name])
        this.setState({
          disableNames:names
        })
      }else if(!isDisable){
        var index = this.state.disableNames.indexOf(name);
        if (index != -1) {
          var names = this.state.disableNames;
          names.splice(index,1);
          this.setState({
            disableNames:names
          })
        };
      }

  },
  setButtons:function(arr){
    this.setState({
      buttons:arr
    })
  }
  
});
var Title = React.createClass({
  getInitialState() {
      return {
          title:''  
      };
  },

  render:function(){
    return (<View style={styles.title}>
            <Text numberOfLines = {1} style={styles.titleText}>{this.state.title  || this.props.title}</Text>
          </View>)
  }
})
var styles =     StyleSheet.create({
  container:{

    flex:1,
    flexDirection:'row',
    height:Platform.OS == 'ios' ? 66:46,
    width: window.width,
    paddingTop:Platform.OS == 'ios' ? 20:0,
    top:0,
    left:0,
    right:0,
    position:'absolute',
    // paddingLeft:10,
    // paddingRight:10,
    borderBottomWidth:.5,
    borderBottomColor:'#e7e7e7',
    backgroundColor: '#fbfbfb'
  },
  
  backBtn:{
    alignItems:'flex-start',
    // backgroundColor:'red',
    justifyContent:'center',
    // flex:1,
    width:85,
  },
  backBtnInner:{
    paddingLeft:10,
    paddingRight:10,
    paddingTop:10,
    paddingBottom:10,
    flexDirection:'row',
    justifyContent:'center',
  },
  navBtn:{
    color:'#00c7b2',
    lineHeight:17,

  },
  title:{
    flex:1,
    justifyContent:'center',

  },
  titleText:{
    textAlign:'center',
    fontSize:18,
    color:'#333'
  },
  iconfont:{
    width:20,height:20,
    //flex:1,

  },
  navBtnCt:{
    // flex:1,
    width:85,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-end'
  },
  rightBtnInner:{
    paddingRight:10
  },
  rightBtnTextCt:{
    // textAlign:'right',
    // textAlignVertical:'center',
     // backgroundColor:'rgba(0,255,0,.6)',
    flex : 1,
    height:46,
    justifyContent:'center',
    alignItems:'flex-end'
    // paddingTop:15,
    // paddingBottom:15,
  }
});
module.exports = NavbarWrapper