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
import I18n from '../utils/i18n';

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
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
          actions={[
            { title: I18n.t('done'), iconName: 'timeline', iconSize: 26, show: 'always' },
          ]}
          onActionSelected={(position) => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <Text>Notification</Text>
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
