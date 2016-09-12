
'use strict';

//var NativeMethodsMixin = require('NativeMethodsMixin');
var React = require('react-native');
var {
ReactChildren,
ReactNativeViewAttributes,
StyleSheet,
View,
requireNativeComponent,
NativeModules,
Platform
}= React;
var isAndriod = Platform.OS !='ios'

if (Platform.OS === 'android') {
  var AKRCTPickerConsts = {};
  var AKRCTPicker = null;
} else {
  var AKRCTPickerConsts = NativeModules.UIManager.AKRCTPicker.Constants;
  var AKRCTPicker = requireNativeComponent('AKRCTPicker', null);
}


var PICKER = 'akrnpicker';

var Picker = React.createClass({
  //mixins: [NativeMethodsMixin],

  propTypes: {
    onValueChange: React.PropTypes.func,
    selectedValue: React.PropTypes.any, // string or integer basically
  },
  getDefaultProps: function(){
      return {
        frame: {x: 0, y: 0, width: 0, height: 0, condition: 'auto',children:[]},
      };
    },
  getInitialState: function() {
    return this._stateFromProps(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(this._stateFromProps(nextProps));
  },

  _stateFromProps: function(props) {
    var selectedIndex = 0;
    var items = [];
    var groups = props.groups ? props.groups: [];
    props.children && props.children.forEach(props.children, function (child, index) {
      if (child.props.value === props.selectedValue) {
        selectedIndex = index;
      }
      items.push({value: child.props.value, label: child.props.label});
    });
    var selectedGroupsAndRow = [];
    for (var i = 0; i < groups.length; i++) {
      var arr = groups[i];
      for (var j = 0; j < arr.length; j++) {
        var opt = arr[j];
        opt.label+='';
        opt.value+=''
        if (opt.selected) {
          selectedGroupsAndRow.push({
            group:i,row:j
          })
        };
      };
    };
    return {selectedIndex, items,groups,selectedGroupsAndRow};
  },

  render: function() {
    if (isAndriod) {
      return null;
    };
    return (
      <View style={this.props.style}>
        <AKRCTPicker
          ref={PICKER}
          box={this.props.frame}
          style={styles.picker}
          items={this.state.groups.length ? [] : this.state.items}
          groups={this.state.items.length ? [] : this.state.groups}
          selectedIndex={this.state.selectedIndex}
          onChange={this._onChange}
          groupWidth={this.props.groupWidth || 100}
          selectedGroupsAndRow={this.state.selectedGroupsAndRow}
        />
      </View>
    );
  },

  _onChange: function(event) {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    if (this.props.onValueChange) {
      this.props.onValueChange(event.nativeEvent.newValue);
    }

    // The picker is a controlled component. This means we expect the
    // on*Change handlers to be in charge of updating our
    // `selectedValue` prop. That way they can also
    // disallow/undo/mutate the selection of certain values. In other
    // words, the embedder of this component should be the source of
    // truth, not the native component.
    if (this.state.groups.length) {return};
    if (this.state.selectedIndex !== event.nativeEvent.newIndex) {
      this.refs[PICKER].setNativeProps({
        selectedIndex: this.state.selectedIndex
      });
    }
  },
});

Picker.Item = React.createClass({
  propTypes: {
    value: React.PropTypes.any, // string or integer basically
    label: React.PropTypes.string,
  },

  render: function() {
    // These items don't get rendered directly.
    return null;
  },
});

var styles = StyleSheet.create({
  picker: {
    // The picker will conform to whatever width is given, but we do
    // have to set the component's height explicitly on the
    // surrounding view to ensure it gets rendered.
    height: AKRCTPickerConsts.ComponentHeight,
  },
});

module.exports = Picker;
