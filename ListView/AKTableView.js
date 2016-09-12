// var AKCollectionViewIOS = require('./AKCollectionView.ios')
// var AKCollectionViewAndroid = require('./RecyclerView')
var React = require('react-native');
var {
 Platform,
 View,
 Text
} = React;
module.exports = {
    AKTableView(){
        if (Platform.OS === 'android') {
            console.log('get tableview view from android');
            return require('./RecyclerView');
        }else{
            console.log('get tableview view from ios');
            return require('./RNTableView.ios');
        }
    }
}