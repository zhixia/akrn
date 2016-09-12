
'use strict';

var React = require('react-native');

var {
    View,
    StyleSheet,
    AppRegistry,
    Component,
} = React;

import SiblingsManager from './SiblingsManager';
import SiblingContainer from './SiblingContainer';

let styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    }
});

// inject modals into app entry component
let originRegister = AppRegistry.registerComponent;
AppRegistry.registerComponent = function (appKey, getComponentFunc) {
    return originRegister(appKey, () => {
        let Origin = getComponentFunc();
        return React.createClass({
            displayName: `Root(${appKey})`,
            getInitialState() {
                return {
                    siblings: {},
                    update: null
                };
            },

            componentWillMount() {
                SiblingsManager.addListener('set', this.onSet);
                SiblingsManager.addListener('update', this.onUpdate);
                SiblingsManager.addListener('destroy', this.onDestroy);
            },

            onSet(element, manager, id) {
                this.state.siblings[id] = {
                    element,
                    manager
                };
                this.forceUpdate();
            },

            onUpdate(element, prevElement, id) {
                this.state.siblings[id].element = element;
                this.setState({
                    update: id
                });
            },

            onDestroy(destroyed, id) {
                delete this.state.siblings[id];
                this.forceUpdate();
            },

            getSiblings() {
                var arr = [];
                var siblingsObj = this.state.siblings;
                for(var id in siblingsObj){
                    var value = siblingsObj[id];
                    var sibling = (
                           <SiblingContainer
                            key={`value-${id}`}
                            shouldUpdate={this.state.update == id}
                            manager={value.manager}
                        >
                            {value.element}
                        </SiblingContainer>  
                    );
                    arr.push(sibling);
                }

                this.state.update = null;
                return arr;
            },

            render() {
                return <View style={styles.container}>
                    <SiblingContainer
                        root={true}
                        shouldUpdate={false}
                    >
                        <Origin {...this.props} />
                    </SiblingContainer>
                    {this.getSiblings()}
                </View>;
            }
        });
    });
};

export default SiblingsManager;
