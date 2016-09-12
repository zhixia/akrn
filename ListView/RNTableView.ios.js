'use strict';
var React = require('react-native');
var {NativeMethodsMixin, ReactNativeViewAttributes, NativeModules,Image,Text, StyleSheet, View,requireNativeComponent} = React;
var RNTableViewConsts = NativeModules.UIManager.RNTableView.Constants;
var sourceImage = require('../resources/images');
var TABLEVIEW = 'tableview';
function extend(el, map) {
    for (var i in map)
        if (typeof(map[i])!='object')
            el[i] = map[i];
    return el;
}
var TableView = React.createClass({
    mixins: [NativeMethodsMixin],

    propTypes: {
        onPress: React.PropTypes.func,
        selectedValue: React.PropTypes.any, // string or integer basically
        autoFocus: React.PropTypes.bool,
        moveWithinSectionOnly: React.PropTypes.bool,
        json: React.PropTypes.string,
        editActions: React.PropTypes.string,
        textColor: React.PropTypes.string,
        detailTextColor: React.PropTypes.string,
        tintColor: React.PropTypes.string,
        footerLabel: React.PropTypes.string,
        headerFont: React.PropTypes.number,
        headerTextColor: React.PropTypes.string,
        footerTextColor: React.PropTypes.string,
        separatorColor: React.PropTypes.string,


        /**
         * The amount by which the content is inset from the edges
         * of the TableView. Defaults to `{0, 0, 0, 0}`.
         * @platform ios
         */
        contentInset: React.EdgeInsetsPropType,
        /**
         * Used to manually set the starting scroll offset.
         * The default value is `{x: 0, y: 0}`.
         * @platform ios
         */
        contentOffset: React.PointPropType,
        /**
         * The amount by which the scroll view indicators are inset from the
         * edges of the TableView. This should normally be set to the same
         * value as the `contentInset`. Defaults to `contentInset` or
         * `{0, 0, 0, 0}`.
         * @platform ios
         */
        scrollIndicatorInsets: React.EdgeInsetsPropType,
    },

    getInitialState: function() {
        return this._stateFromProps(this.props);
        // return {};
    },
    getDefaultProps: function(){

        return {
            
        }
    },
    componentDidMount: function() {
        // console.log('sections',this.sections);
    },
    componentWillReceiveProps: function(nextProps) {
        var state = this._stateFromProps(nextProps);
        this.setState(state);
        
    },

    createSection: function(cell){
        return <AKSection>{cell}</AKSection>
    },
    createCell: function(sectionIndex, rowIndex, rowData){
        var key = 't-' + sectionIndex + '-' + rowIndex;

        return <AKCell
                key = {rowIndex}
                row = {rowIndex}
                section = {sectionIndex}
                >
                    {this.props.renderRow(rowData, sectionIndex, rowIndex)}
                </AKCell>
    },
    
    // Translate TableView prop and children into stuff that RNTableView understands.
    _stateFromProps: function(props) {
        // debugger
        var self = this;
        this._originProps = Object.assign({},props)
        var sections = [];
        var additionalItems = [];
        var children = [];
        var json = props.json;
        var dataSource = props.dataSource;
        dataSource.forEach(function(rowDatas, sectionIndex){
            // console.log('sectionIndex', sectionIndex, rowDatas);

            var items=[];
            var count = 0;

            rowDatas.forEach(function(rowData, rowIndex){

                var el = {};
                var key = 't-' + sectionIndex + '-' + rowIndex;
                // //extend(el, section.props);
                el.key = key;
                
                var cell = self.createCell(sectionIndex, rowIndex, rowData);
                extend(el, cell.props.children.props);
                // el.label = cell;
                count++;
                // count++;
                items.push(el);
                // var element = React.cloneElement(cell, {
                //     key: key, 
                //     section: sectionIndex, 
                //     row: rowIndex
                // });
                children.push(cell);
                // console.log('children', children);
            });
            sections.push({
                customCells: true,
                label: undefined,
                footerLabel: undefined,
                footerHeight: undefined,
                headerHeight: undefined,
                items: items,
                count: count
            });
        });

        this.sections = sections;
        // console.log('this.Section', this.sections);
        this._sections = Object.assign({},sections);
        var editActions = this.props.editActions || [];
        // console.log('section items length ',{ dataSource, additionalItems, children, json});
        return { dataSource, additionalItems, children, json, editActions};
    },
   
    getXY:function  (cb) {
        NativeModules.RNTableViewManager.getXY(React.findNodeHandle(this.refs[TABLEVIEW]),cb);  
    },
    deleteRow:function  (sectionIndex,rowIndex,cb) {
         NativeModules.RNTableViewManager.deleteRow(React.findNodeHandle(this.refs[TABLEVIEW]),sectionIndex,rowIndex,cb);
        //  this.deleteCell(sectionIndex,rowIndex);
    },
    headerRefreshDone:function  () {
        NativeModules.RNTableViewManager.headerEndRefreshing(
           React.findNodeHandle(this.refs[TABLEVIEW])
        )
    },
    headerBeginRefreshing:function  () {
        NativeModules.RNTableViewManager.headerBeginRefreshing(
           React.findNodeHandle(this.refs[TABLEVIEW])
        )
    },
    
    render: function() {
        // console.log('RNTableView render', this.state.children);
        var tableViewCellSelectionStyle = TableView.Consts.CellSelectionStyle.gray;
        if(typeof this.props.cellSelectionStyle !='undefined'){
            if(this.props.cellSelectionStyle == 'none'){
                tableViewCellSelectionStyle = TableView.Consts.CellSelectionStyle.none;
            }
            if(this.props.cellSelectionStyle == 'gray'){
                tableViewCellSelectionStyle = TableView.Consts.CellSelectionStyle.gray;
            }
            if(this.props.cellSelectionStyle == 'default'){
                tableViewCellSelectionStyle = TableView.Consts.CellSelectionStyle.default;
            }
        }
        return (
            <View style={[{flex:1},this.props.style]}>

                <RNTableView
                    ref={TABLEVIEW}
                    onRefresh={this.props.onHeaderRefresh}
                    style={this.props.style}
                    sections={this.sections}
                    additionalItems={this.state.additionalItems}
                    tableViewStyle={TableView.Consts.Style.Plain}
                    tableViewCellStyle={TableView.Consts.CellStyle.Subtitle}
                    tableViewCellSelectionStyle={tableViewCellSelectionStyle}
                    //scrollIndicatorInsets={this.props.contentInset}
                    contentInset = {this.props.contentInset}
                    {...this.props}
                    json={this.state.json}
                    editActions={this.state.editActions}
                    onPress={this._onPress}
                    onChange={this._onChange}>

                    {this.state.children}
                </RNTableView>
            </View>
        );
    },

    _onPress: function(event) {
        // console.log(event);
        var data = event.nativeEvent;
        var cell = this.getCell(data);
        if (cell && cell.onPress){
             this.sections[data.selectedSection].items[data.selectedIndex].onPress(data);
        }
        if (this.props.onPress) {
            this.props.onPress(data);
        }
        event.stopPropagation();
    },
    _onChange: function(event) {
        var self = this;
        if (event.nativeEvent.mode =='press') {
            this._onPress(event);
            return;
        }else{
            var data = event.nativeEvent;
            var mode = data.mode;
            var cell = this.getCell(data);
            var rowIndex = data.selectedIndex;
            var selectedSection = data.selectedSection;
            // console.log('_onChange', cell);
            if (mode =='scrollEnd' && this.props.onScrollEnd) {
                this.props.onScrollEnd(event.nativeEvent.x,event.nativeEvent.y,event.nativeEvent.size,event.nativeEvent.contentSize)
            }else if(cell && mode == 'delete' && self.props.deleteRow){

                self.props.deleteRow(selectedSection,rowIndex, function(cb){
                    var dataSource = self.state.dataSource;
                    if (dataSource[selectedSection] && dataSource[selectedSection].length ) {
                        dataSource[selectedSection].splice(rowIndex,1);
                    };
                
                    self._stateFromProps({dataSource: dataSource});
                    self.deleteRow(selectedSection, rowIndex, function(){
                        cb(dataSource);
                    })
                })
            }else if(cell && mode == 'sticky' && self.props.stickyRow){
                self.props.stickyRow(selectedSection, rowIndex, function(cb){
                    var dataSource = self.state.dataSource;
                    if (dataSource[selectedSection] && dataSource[selectedSection].length ) {
                        var stickyObject = dataSource[selectedSection].splice(rowIndex,1); // 删除当前要移动的元素
                        dataSource[selectedSection] = stickyObject.concat(dataSource[selectedSection]); // 移到数组最顶端
                    };
                    self.setState(self._stateFromProps({dataSource: dataSource}));
                    NativeModules.RNTableViewManager.reloadData(React.findNodeHandle(self.refs[TABLEVIEW]),function(){
                        cb && cb(dataSource);    
                    });
                })
            }else if(cell && self.props.onEditAction){
                 self.props.onEditAction(selectedSection, rowIndex, function(cb){
                    NativeModules.RNTableViewManager.reloadData(React.findNodeHandle(self.refs[TABLEVIEW]),function(){
                    });
                })
            }
            if (this.props.onChange) {
                this.props.onChange(data);
            }
        }
        
        event.stopPropagation();
    },
    getCell:function  (data) {
        return (typeof data.selectedSection =='number')&& (typeof data.selectedIndex =='number') ?
         this.sections[data.selectedSection].items[data.selectedIndex]:
        null
    },
    deleteCell:function  (sectionIndex,rowIndex) {
        // var item = this.sections[sectionIndex].items[rowIndex];
        // var key = item.key;
        // var cell = this._originProps.children.props.children;
        // var index= null ;
        // if (cell && cell.length) {
        //     for (var i = 0; i < cell.length; i++) {
        //         if(cell[i].key == key){
        //             index = i;
        //             break;
        //         }
        //     };
        // };
        // if (index != null) {
        //     this._originProps.children.props.children.splice(index,1);
        //     this._stateFromProps(this._originProps)
        // };
        //sections[data.selectedSection].items.splice(data.selectedIndex,1);被密封无法删除
    }
});

TableView.Item = React.createClass({
    propTypes: {
        value: React.PropTypes.any, // string or integer basically
        label: React.PropTypes.string,
    },

    render: function() {
        // These items don't get rendered directly.
        return null;
    },
});

TableView.Footer = React.createClass({
    getInitialState(){
        return {width:0, height:0}
    },
    render: function() {
        return <RNFooterView onLayout={(event)=>{this.setState(event.nativeEvent.layout)}} {...this.props} componentWidth={this.state.width} componentHeight={this.state.height}/>
    },
});
var RNFooterView = requireNativeComponent('RNTableFooterView', null);

TableView.Header = React.createClass({
    getInitialState(){
        return {width:0, height:0}
    },
    render: function() {
        return <RNHeaderView onLayout={(event)=>{this.setState(event.nativeEvent.layout)}} {...this.props} componentWidth={this.state.width} componentHeight={this.state.height}/>
    },
});
var RNHeaderView = requireNativeComponent('RNTableHeaderView', null);

TableView.Cell = React.createClass({
    getInitialState(){
        return {width:0, height:0}
    },
    render: function() {
        return <RNCellView onLayout={(event)=>{this.setState(event.nativeEvent.layout)}} {...this.props} componentWidth={this.state.width} componentHeight={this.state.height}/>
    },
});
var AKCell = TableView.Cell;
var RNCellView = requireNativeComponent('RNCellView', null);

TableView.Section = React.createClass({
    propTypes: {
        label: React.PropTypes.string,
        footerLabel: React.PropTypes.string,
        arrow: React.PropTypes.bool,
        footerHeight: React.PropTypes.number,
        headerHeight: React.PropTypes.number,

    },

    render: function() {
        // These items don't get rendered directly.
        return null;
    },
});
var AKSection = TableView.Section;

var styles = StyleSheet.create({
    tableView: {
        // The picker will conform to whatever width is given, but we do
        // have to set the component's height explicitly on the
        // surrounding view to ensure it gets rendered.
        //height: RNTableViewConsts.ComponentHeight,
    },
});
TableView.Consts = RNTableViewConsts;

var RNTableView = requireNativeComponent('RNTableView', null);

module.exports = TableView;
