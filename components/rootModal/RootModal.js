'use strict';

import React,{
    View,
    Animated,
    Component,
    PropTypes,
    AppRegistry
} from 'react-native';

import RootSiblings from '../rootSiblings/RootSiblings';
import ModalContainer from './ModalContainer';

var RootModal = React.createClass({
    getDefaultProps(){
        visible:false
    },
    componentWillMount(){
         this._modal = new RootSiblings(<ModalContainer
            {...this.props}
        />
        );       
    },
    componentWillReceiveProps(nextProps){
        this._modal.update(<ModalContainer
            {...nextProps}
        />);
    },
    componentWillUnmount(){
        this._modal.destroy();
    },
    render() {
        return null;
    }

})

let AnimatedModal = Animated.createAnimatedComponent(RootModal);

if (!Animated.RootModal) {
    Animated.RootModal = AnimatedModal;
}

AppRegistry.registerComponent('RootModal', () => RootModal);

// export {
//     RootSiblings as Manager,
//     AnimatedModal as Animated
// }
module.exports = RootModal;