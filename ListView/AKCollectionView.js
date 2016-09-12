// var AKCollectionViewIOS = require('./AKCollectionView.ios')
// var AKCollectionViewAndroid = require('./RecyclerView')
var React = require('react-native');
var {
 Platform
} = React;
module.exports = {
    AKCollectionView(){
        if (Platform.OS === 'android') {
            console.log('get collection view from android');
            return require('./RecyclerView')
        }
        console.log('get collection view from ios');
        return require('./AKCollectionView.ios')
    }
}