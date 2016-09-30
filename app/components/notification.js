import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// 3rd party libraries
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';

import commonStyle from '../utils/common-styles';

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
  body: {
    flex: 1,
    marginVertical: 2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default class NotificationView extends Component {
  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: '#4A4A4A' }}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="#4A4A4A"
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <View style={styles.body}>
          <Text>No notifications yet</Text>
        </View>
      </View>
    );
  }
}

NotificationView.propTypes = {
  title: React.PropTypes.string,
};

NotificationView.defaultProps = {
  title: '',
};
