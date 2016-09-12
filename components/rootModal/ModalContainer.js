'use strict';

var React = require('react-native');

var {
    View,
    StyleSheet,
    AppRegistry,
    Component,
    PropTypes,
    TouchableWithoutFeedback
} = React;


let styles = StyleSheet.create({
    defaultModalStyle: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
});

var ModalContainer = React.createClass({
    getDefaultProps(){
        return {
            visible:false
        }
    },
    getInitialState(){
        return {
            visible:false
        }
    },
    componentWillReceiveProps(nextProps){
        if (nextProps.visible !== this.props.visible) {
            this.setState({
                visible: nextProps.visible
            });
        }
    },
    shouldComponentUpdate(nextProps){
        return nextProps.visible || nextProps.visible !== this.props.visible;
    },
    render(){
        return this.props.visible ? 
            ( 
            <TouchableWithoutFeedback onPress={this.props.onPressModal}>
            <View style={this.props.style || styles.defaultModalStyle} {...this.props} ></View>
            </TouchableWithoutFeedback> )
        : null
    }
})


module.exports=ModalContainer;