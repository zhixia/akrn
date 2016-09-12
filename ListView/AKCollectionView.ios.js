'use strict';
var React = require('react-native');
var {
    NativeMethodsMixin,
    ReactNativeViewAttributes,
    NativeModules,
    StyleSheet,
    View,
    requireNativeComponent,
    Dimensions,
    Image,
    Text
} = React;

var sourceImage = require('../resources/images');

var ARCTCollectionViewManager = NativeModules.ARCTCollectionViewManager;

var AKCollectionViewConsts = NativeModules.UIManager.ARCTCollectionView.Constants;
var ARCTCollectionRefreshCellViewConsts = NativeModules.UIManager.ARCTCollectionRefreshCellView.Constants;

var COLLECTION_VIEW = 'AKCollectionView';
var window = Dimensions.get('window');

var AKCollectionView = React.createClass({
    mixins: [NativeMethodsMixin],
    propTypes: {
        dataSource: React.PropTypes.array.isRequired,
        renderRow: React.PropTypes.func.isRequired,
        rowGuid: React.PropTypes.func,
        onClick: React.PropTypes.func,
        onRefresh : React.PropTypes.func,
        onInfinite : React.PropTypes.func,
        layout : React.PropTypes.shape({
          type: React.PropTypes.string,//1.'grid',2.'waterfall'
          cellHeight: React.PropTypes.number,//'waterfall'无此配置
          cellWidth : React.PropTypes.number,//'waterfall'无此配置
          minLineSpacing : React.PropTypes.number,//cell的上下最小间距
          minItemSpacing : React.PropTypes.number,//cell的左右最小间距
          sectionInset :React.PropTypes.shape({
              top:React.PropTypes.number,
              left:React.PropTypes.number,
              right:React.PropTypes.number,
              bottom: React.PropTypes.number,
          })
        })
    },
    getDefaultProps: function(){
      return {
        layout : {
            type:'grid',
            cellHeight:100,
            cellWidth:180,
            minLineSpacing: 20,
            minItemSpacing: 5,
            sectionInset:{
                top:0,
                left:5,
                right:5,
                bottom: 0,
        }},
        onClick : () => {},
        headerIdle: function(){
          return <AKRefresh cellType={AKRefresh.Consts.Types.HeaderIdle} style={{width: window.width, height: 50}}>
                  <View style={{justifyContent: 'center', flex:1, alignItems:'center'}}>
                    <Image
                      source={{uri:sourceImage.loading_image}}
                      resizeMode={Image.resizeMode.stretch}
                      style={{width: 50, height: 50}}/>
                  </View>
                </AKRefresh>
        },
        headerPulling: function(){
          return <AKRefresh cellType={AKRefresh.Consts.Types.HeaderPulling} style={{width: window.width, height: 50}}>
                      <View style={{justifyContent: 'center', flex:1, alignItems:'center'}}>
                        <Image
                          source={{uri:sourceImage.loading_image}}
                          resizeMode={Image.resizeMode.stretch}
                          style={{width: 50, height: 50}}/>
                      </View>
                </AKRefresh>
        },
        headerRefreshing: function(){
          return <AKRefresh cellType={AKRefresh.Consts.Types.HeaderRefreshing} style={{width: window.width, height: 50}}>
                    <View style={{justifyContent: 'center', flex:1, alignItems:'center'}}>
                      {sourceImage.loading_gif(50,50)}
                    </View>
                 </AKRefresh>
        },
        footerIdle: function(){
          return <AKRefresh cellType={AKRefresh.Consts.Types.FooterIdle} style={{width: window.width, height: 50}}>
                    <View style={{justifyContent: 'center', flex:1, alignItems:'center'}}>
                        <Image
                          source={{uri:sourceImage.loading_image}}
                          resizeMode={Image.resizeMode.stretch}
                          style={{width: 50, height: 50}}/>
                    </View>
                </AKRefresh>
        },
        footerPulling: function(){
          return <AKRefresh cellType={AKRefresh.Consts.Types.FooterPulling} style={{width: window.width, height: 50}}>
                    <View style={{justifyContent: 'center', flex:1, alignItems:'center'}}>
                        <Image
                          source={{uri:sourceImage.loading_image}}
                          resizeMode={Image.resizeMode.stretch}
                          style={{width: 50, height: 50}}/>
                    </View>
                </AKRefresh>
        },
        footerRefreshing: function(){
          return <AKRefresh cellType={AKRefresh.Consts.Types.FooterRefreshing} style={{width: window.width, height: 50}}>
                      <View style={{justifyContent: 'center', flex:1, alignItems:'center'}}>
                        {sourceImage.loading_gif(50,50)}
                      </View>
                  </AKRefresh>
        },
        footerNoMoreData: function(){
          return <AKRefresh cellType={AKRefresh.Consts.Types.FooterNoMoreData} style={{width: window.width, height: 50}}>
                    <View style={{justifyContent: 'center', flex:1, alignItems:'center'}}>
                      <Text style={{color: '#9d9d9d', fontSize:14, textAlign: 'center',alignItems:'center',justifyContent: 'center'}}>没有更多数据了...</Text>
                    </View>
                 </AKRefresh>
        }
      }
    },
    getInitialState: function() {
        return {
            refreshCells: this._refreshCells(this.props),
            rows: this._renderRows(this.props)
        };
    },
    componentWillReceiveProps: function(nextProps) {
        var state = this._stateFromProps(nextProps);
        this.setState(state);
    },
    _stateFromProps: function(props) {
        return {
            refreshCells: this._refreshCells(props),
            rows: this.props.dataSource === props.dataSource? this.state.rows : this._renderRows(props)
        };
    },
    _refreshCells : function(props){
       var refreshCells = [];
       this.props.onRefresh && refreshCells.push(React.cloneElement(this.props.headerIdle(), {key:"headerIdle",cellType: 'headerIdle'}));
       this.props.onRefresh && refreshCells.push(React.cloneElement(this.props.headerPulling(), {key:"headerPulling",cellType: 'headerPulling'}));
       this.props.onRefresh && refreshCells.push(React.cloneElement(this.props.headerRefreshing(), {key:"headerRefreshing",cellType: 'headerRefreshing'}));
       this.props.onInfinite && refreshCells.push(React.cloneElement(this.props.footerIdle(), {key:"footerIdle",cellType: 'footerIdle', }));
       this.props.onInfinite && refreshCells.push(React.cloneElement(this.props.footerPulling(), {key:"footerPulling",cellType: 'footerPulling'}));
       this.props.onInfinite && refreshCells.push(React.cloneElement(this.props.footerRefreshing(), {key:"footerRefreshing",cellType: 'footerRefreshing'}));
       this.props.onInfinite && refreshCells.push(React.cloneElement(this.props.footerNoMoreData(), {key:"footerNoMoreData",cellType: 'footerNoMoreData'}));
       return refreshCells
    },
    _renderRows: function(props) {
        if(this.props.dataSource == null || this.props.dataSource.length == 0){
            return null
        }
        var dataSource = props.dataSource;
        var cellData = this.cellData = {};
        var rows = [];
        for (var sectionIdx = 0; sectionIdx < dataSource.length; sectionIdx++) {
            var section = dataSource[sectionIdx];
            for (var rowIdx = 0; rowIdx < section.length; rowIdx++) {
                var rowData = section[rowIdx];
                var content = this.props.renderRow(
                    rowData,
                    sectionIdx,
                    rowIdx,
                    this._onRowHighlighted
                );
                var rowGuid = this.props.rowGuid ? this.props.rowGuid(
                    rowData,
                    sectionIdx,
                    rowIdx,
                ) : this._defaultRowGuid(rowData);
                var row =
                    <AKCell
                        key = {rowGuid}
                        indexPath = {{section: sectionIdx, item: rowIdx}}
                        style = {{
                            height: content.props.size ? content.props.size.height : this.props.layout.cellHeight,
                            width: content.props.size ? content.props.size.width : this.props.layout.cellWidth
                        }}
                        content = {content}
                        ref = {(row) => {
                            PrivateMethods.captureReferenceFor(cellData, row);
                        }}
                    >
                    </AKCell>

                rows.push(row);
            }
        }
        return rows;
    },
    _defaultRowGuid: function(rowData) {
        if (!this._generatedId) {
            this._generatedId = 0;
        }
        return (this._generatedId++).toString();
    },
    render: function() {
        if(this.props.dataSource == null || this.props.dataSource.length == 0){
          return null
        }
        if(this.collectionview) {
            return React.cloneElement(this.collectionview, {cellCount:this.state.rows.length}, this.state.refreshCells, this.state.rows);
        } else {
            return this.collectionview = (
                <ARCTCollectionView
                    ref={COLLECTION_VIEW}
                    style={this.props.style}
                    layout={this.props.layout}
                    contentInset = {this.props.contentInset}
                    cellCount={this.state.rows.length}
                    onLoadCell={this._onLoadCell}
                    onUnloadCell={this._onUnloadCell}
                    onClick={this._onClick}
                    onRefresh = {this._onRefresh}
                    onInfinite={this._onInfinite}

                >
                    {this.state.refreshCells}
                    {this.state.rows}

                </ARCTCollectionView>
            );
        }


    },

    _onRefresh: function(event){
        var reactTag = event.nativeEvent.reactTag || React.findNodeHandle(this);
        if(!this.props.onRefresh){
          NativeModules.ARCTCollectionViewManager.headerEndRefreshing(reactTag);
        }else{
          this.props.onRefresh(function(code){
              if(code == 'no-more-data'){
                NativeModules.ARCTCollectionViewManager.headerEndRefreshing(reactTag);
              }else{
                NativeModules.ARCTCollectionViewManager.headerEndRefreshing(reactTag);
              }
          });
        }
    },
    _onInfinite: function(event){
        var reactTag = event.nativeEvent.reactTag || React.findNodeHandle(this);
        if(!this.props.onInfinite){
          NativeModules.ARCTCollectionViewManager.footerEndRefreshing(reactTag);
        }else{
          this.props.onInfinite(function(code){
              if(code == 'no-more-data'){
                  NativeModules.ARCTCollectionViewManager.footerEndRefreshingNoMoreData(reactTag, 60);
              }else{
                  NativeModules.ARCTCollectionViewManager.footerEndRefreshing(reactTag);
              }
          });
        }
    },

    _onRowHighlighted: function(sectionID, rowID) {
        this.setState({highlightedRow: {sectionID, rowID}});
    },

    _onClick: function(event) {
        console.log('原生event已经触发');
        var data = event.nativeEvent;

        if (this.props.onClick) {
            this.props.onClick(data);
        }
        event.stopPropagation();
    },
    _onLoadCell: function(event) {
        var data = event.nativeEvent;
        var currentCell = this.cellData[data.section][data.item];
        currentCell.setVisibility(true);
        event.stopPropagation();
    },
    _onUnloadCell: function(event) {
        var data = event.nativeEvent;
        var currentCell = this.cellData[data.section][data.item];
        currentCell.setVisibility(false);
        event.stopPropagation();
    }
});

var PrivateMethods = {
    captureReferenceFor: function(cellData, row) {
        var sectionId = row && row.props.indexPath.section;
        var rowId = row && row.props.indexPath.item;
        if (cellData[sectionId] === undefined) {
            cellData[sectionId] = {};
        }

        cellData[sectionId][rowId] = row; // Capture the reference
    },
}

AKCollectionView.Cell = React.createClass({
    propTypes: {
        content: React.PropTypes.element.isRequired
    },
    getInitialState(){
        return {
            visibility: true,
        }
    },
    componentWillMount() {
        // Don't want to trigger a render pass, so we're putting the view property
        // data directly on the class
        this.viewProperties = {
            width: 0, // the view defaults to width of size 0
            height: 0, // the view defaults to height of size 0
        };
    },

    render: function() {
        if (this.state.visibility === false) {
            return (
                <ARCTCollectionCellView size={this.props.content.props.size} style={{width:this.viewProperties.width, height:this.viewProperties.height}} {...this.props} />
            );
        }
        return (
            <ARCTCollectionCellView onLayout={this.onLayout} size={this.props.content.props.size} {...this.props}>
                {this.props.content}
            </ARCTCollectionCellView>
        );

        // return <ARCTCollectionCellView onLayout={(event)=>{this.setState(event.nativeEvent.layout)}} {...this.props} />
    },

    onLayout(evt) {
        // When the cell has actually been layed out, record the rendered width & height
        this.viewProperties.width = evt.nativeEvent.layout.width;
        this.viewProperties.height = evt.nativeEvent.layout.height;
    },
    setVisibility(visibility) {
        if (this.state.visibility == visibility) {
            return; // already have the passed in state, so return early
        }

        if (visibility == true) {
            this.setState({visibility: true});
        } else {
            this.setState({visibility: false});
        }
    },
});


AKCollectionView.RefreshCell = React.createClass({
    getInitialState(){
        return {width:0, height:0}
    },
    render: function() {
        return <ARCTCollectionRefreshCellView onLayout={(event)=>{this.setState(event.nativeEvent.layout)}} {...this.props} />
    },
});

//重定义AKCell and AKRefresh
var AKCell = AKCollectionView.Cell;
var AKRefresh = AKCollectionView.RefreshCell;

//常量
AKCollectionView.Consts = AKCollectionViewConsts;
AKCollectionView.RefreshCell.Consts = ARCTCollectionRefreshCellViewConsts;

//native模块
var ARCTCollectionView = requireNativeComponent('ARCTCollectionView', null);
var ARCTCollectionCellView = requireNativeComponent('ARCTCollectionCellView', null);
var ARCTCollectionRefreshCellView = requireNativeComponent('ARCTCollectionRefreshCellView', null);

module.exports = AKCollectionView;