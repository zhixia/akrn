/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';
import React, {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Animated,
    Dimensions,
    LayoutAnimation,
    NativeModules
} from 'react-native'
const Iconfont = require('./AKIconfont');
var UIManager = NativeModules.UIManager;
var type1 = 'rectangle';
var type2 = 'circle';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
var window = Dimensions.get('window');
var Grid = React.createClass({
    propTypes: {
        onItemClick: React.PropTypes.func,
        onClickBefore: React.PropTypes.func,
        dataModel : React.PropTypes.shape({
          type: React.PropTypes.string,//1.'rectangle',2.'circle'
          width: React.PropTypes.number,//组件总宽
          gridNum : React.PropTypes.number.isRequired,//一行显示几个cell
          isMultiple : React.PropTypes.boolean,//是否可以多选，rectangle下只能false
          map :React.PropTypes.array.isRequired
        })
    },
    getDefaultProps() {
        return{
            onItemClick:function(value,index,values,flag){
            },
            onClickBefore:function(value,index,values){
            }
        }
    },
    componentWillReceiveProps(nextProps){
        var map = nextProps.dataModel.map;
        var selectValue = nextProps.dataModel.value[0];
        var index = -1;
        if(this.props.dataModel.type==type1){
            for(var i=0;i<map.length;i++){
                if(map[i].value==selectValue){
                    index = i;
                }
            }
        }
        this.state.activeIndex.setValue(index);
        this.setState({
            value: nextProps.dataModel.value||[],
            disabled:nextProps.dataModel.disabled||[],
        });
        LayoutAnimation.easeInEaseOut();
    },
    getInitialState() {
        //计算矩形模式下 选中块的index
        var map = this.props.dataModel.map;
        var selectValue = this.props.dataModel.value[0];
        var index = -1;
        if(this.props.dataModel.type==type1){
            for(var i=0;i<map.length;i++){
                if(map[i].value==selectValue){
                    index = i;
                }
            }
        }
        return {
            value: this.props.dataModel.value||[],
            dataSource: map,
            disabled:this.props.dataModel.disabled||[],
            activeIndex:new Animated.Value(index),
        };
    },
    render() {
        var me = this;
        var dataModel = this.props.dataModel;
        var uiTitle,AnimatedView;
        var bgColor='#eee';
        if(dataModel.uiTitle){
           uiTitle=(
                <View style={[styles.uiTitle,{width:dataModel.width+2}]}>
                    <Text style={[{fontSize:14,color:'#666'}]}>{this.props.dataModel.uiTitle}</Text>
                </View>
           )
        }
        if(dataModel.type==type1){
            bgColor = '#fff';
            var index = this.state.activeIndex._value;
            var width = dataModel.width/dataModel.gridNum;
            var maxC = Math.ceil(dataModel.map.length/dataModel.gridNum);
            var left = index%dataModel.gridNum*width;
            var curC = Math.ceil((index+1)/dataModel.gridNum);
            var top = (curC-1)*90;
            if(this.state.activeIndex._value!=-1){
                AnimatedView=(
                    <Animated.View
                            style={{
                                width: dataModel.width / dataModel.gridNum,
                                height: 90,
                                backgroundColor: 'rgba(187,232,227,.3)',
                                position: 'absolute',
                                left: left,
                                top:top
                            }}/>
                )
            }
        }
        return (
            <View>
                {uiTitle}
                <View style={[styles.list,{width:dataModel.width+2,borderColor:'#ccc',position:'relative',backgroundColor:bgColor}]}>
                     {this.state.dataSource.map(function (data, k) {
                            if(dataModel.type==type1){
                                return me._renderRectRow(data,k);
                            }else if(dataModel.type==type2){
                                return me._renderCircleRow(data,k);
                            }
                            
                        }) }
                     {AnimatedView}
                </View>
            </View>
            );
    },
    //渲染矩形row单选
    _renderRectRow(data,k) {
        var icon = data.icon;
        var dataModel = this.props.dataModel;
        var maxC = Math.ceil(dataModel.map.length/dataModel.gridNum);
        var gridStyle={};
        var color='#666';
        var isDisable={};
        if(this.state.value[0]==data.value){
            color='#06C9B3';
        }
        if(dataModel.disabled===true||this.state.disabled.indexOf(k)>-1){
            isDisable.opacity=0.4;
        }
        //右侧一行不显示rightborder
        if(k&&(k+1)%dataModel.gridNum==0){
            gridStyle.borderRightWidth=0;
        }
        //底部一行不显示bottomborder
        if(Math.ceil((k+1)/dataModel.gridNum)==maxC){
            gridStyle.borderBottomWidth=0;
        }
        return (
            <View style={[styles.gridRectCell,{ width: dataModel.width / dataModel.gridNum},gridStyle]} key={k}>
                <TouchableHighlight  underlayColor="#fff"  onPress={this._onPress.bind(this, data.value,k) } style={[isDisable,{ width: dataModel.width / dataModel.gridNum,height:90,justifyContent: 'center',
                alignItems: 'center'}]} >
                    <View>
                        <Iconfont style={{ width: 26, height: 26 ,paddingTop:10,marginBottom:3}} iconfontConfig={{ color: color, bgColor: 'transparent', fontSize: 26, iconCode: icon }} />
                        <Text style={[{color:color}]}>
                            {data.txt}
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>)
    },
    //渲染圆形row 可单选可多选
    _renderCircleRow(data,k) {
        var icon = data.icon;
        var dataModel = this.props.dataModel;
        var color='#999';
        var isDisable={};
        var borderColor={
            maxColor:'rgba(0,199,178,0)',
            midColor:'rgba(0,199,178,0)',
            minColor:'rgba(0,199,178,0)',
        };
        //圆心内容
        var centerCt;
        //底部内容
        var bottomCt;
        if(dataModel.isMultiple){
            if(this.state.value.indexOf(data.value)>-1){
                color='#00c7b2';
                borderColor.maxColor='rgba(0,199,178,.1)';
                borderColor.midColor='rgba(0,199,178,.3)';
                borderColor.minColor='rgba(0,199,178,1)';
            }
        }else{
            if(this.state.value[0]==data.value){
                color='#00c7b2';
                borderColor.maxColor='rgba(0,199,178,.1)';
                borderColor.midColor='rgba(0,199,178,.3)';
                borderColor.minColor='rgba(0,199,178,1)';
            }
        }
        if(dataModel.disabled===true||this.state.disabled.indexOf(k)>-1){
            isDisable.opacity=0.4;
        }
        if(icon){
            centerCt = (<Iconfont style={{ width: 26, height: 26 ,paddingTop:10}} iconfontConfig={{ color: color, bgColor: 'transparent', fontSize: 26, iconCode: icon }} />);
            bottomCt = (<Text style={[styles.text,{color:color}]}>{data.txt}</Text>);
        }else{
            centerCt = (<Text style={[styles.text,{color:color}]}>{data.txt}</Text>);
        }
        return (
             <View style={[styles.gridCircleCell, { width: dataModel.width / dataModel.gridNum}]} key={k}>
                <TouchableHighlight  underlayColor="#eee"  onPress={this._onPress.bind(this, data.value,k) } style={[isDisable,{ width: dataModel.width / dataModel.gridNum,height:100,justifyContent: 'center',
                 alignItems: 'center',}]} >
                    <View style={{alignItems: 'center',justifyContent: 'center'}}>
                        <View style={[styles.outMaxCircle,{borderColor:borderColor.maxColor}]}>
                            <View style={[styles.outMidCircle,{borderColor:borderColor.midColor}]}>
                                <View style={[styles.outMinCircle,{borderColor:borderColor.minColor}]}>
                                    {centerCt}
                                </View> 
                            </View>    
                        </View>    
                        {bottomCt}
                    </View>    
                </TouchableHighlight>
            </View>);
    },
    _onPress(value,index) {
        if(this.props.dataModel.disabled===true||this.props.dataModel.disabled.indexOf(index)>-1){
            return false;
        }
        var dataModel = this.props.dataModel;
        //是否多选，type1只能单选，type2 可多选
        var isMultiple = dataModel.isMultiple&&dataModel.type!=type1;
        var lastValue;
        lastValue=isMultiple?this.state.value:this.state.value[0];
        if(this.props.onClickBefore(value,index,lastValue)===false){
            return false;
        };
        //所有的values
        var selected = this.state.value;
        //当前操作是删除还是选中
        var isSelected = false;
        //多选开关
        if(isMultiple&&dataModel.type!=type1){
            var i = selected.indexOf(value);
            if(i>-1){
                isSelected = false;
                selected.splice(i,1);
            }else{
                isSelected = true;
                selected.push(value);
            }
        }else{
            selected[0]=value;
        }
        this.state.activeIndex.setValue(index);
        this.setState({value:selected});
        LayoutAnimation.easeInEaseOut();
        if(isMultiple){
            //当前点击的value 下标 所有values 删除或者增加
            this.props.onItemClick(value,index,selected,isSelected);
        }else{
            this.props.onItemClick(value,index);
        }
        
    }
})
const styles = StyleSheet.create({
    uiTitle:{
        paddingLeft:20,
        height:26,
        justifyContent:'center',
        backgroundColor:"#eee",
    },
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    gridRectCell: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 90,
        backgroundColor: '#fff',
        borderRightWidth:1,
        borderBottomWidth:1,
        borderColor: '#eaeaea'
    },
    gridCircleCell: {
        justifyContent: 'center',
        height: 100,
        alignItems: 'center',
    },
    //circle3层
    outMaxCircle:{
        width: 72,
        height: 72,
        borderWidth:1,
        borderRadius:72,
        alignItems: 'center',
        justifyContent: 'center'
    },
    outMidCircle:{
        width: 66,
        height: 66,
        borderWidth:1,
        borderRadius:66,
        alignItems: 'center',
        justifyContent: 'center'
    },
    outMinCircle:{
        width: 60,
        height: 60,
        borderWidth:1,
        borderRadius:60,
        backgroundColor:'#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text:{
        fontSize:14,
        height:24,
        marginTop:2,
        lineHeight:18
    }
});
module.exports = Grid;
