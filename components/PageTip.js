var React = require('react-native');
var {
    Image,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback
} = React;
var sourceImage = require('../resources/images');
var PageTip = React.createClass({
    propTypes: {
        text: React.PropTypes.string,
        refresh: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            style: {},
            text: '找不到数据，刷新看看呗！',
            refresh: function () {
                console.log('未传入 refresh fun');
            }
        }
    },
    render: function () {
        return (
            <View style={[, this.props.style, { marginTop: 60, flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <Image source={{ uri: sourceImage.cookbook_default_image }}
                    style={{ height: 99, width: 111 }}/>
                <Text style={{ fontSize: 14, color: '#333333', marginTop: 20 }}>
                    {this.props.text}
                </Text>
                    <TouchableOpacity
                        style ={{
                            marginTop: 30,
                            borderWidth: 1,
                            borderColor: '#00C7B2',
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: 50, paddingRight: 50,
                            paddingTop: 10, paddingBottom: 10,
                        }}
                        onPress={this.props.refresh}>
                        <Text style={{
                            color: '#00C7B2',
                            fontSize: 16,
                        }}>
                            {this.props.btnRefreshText ? this.props.btnRefreshText : '刷新页面'}
                        </Text>

                    </TouchableOpacity>


            </View>
        );
    }
});

module.exports = PageTip;