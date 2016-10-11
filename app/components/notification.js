import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import moment from 'moment';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';

import commonStyle from '../utils/common-styles';
import I18n from '../utils/i18n';

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
  body: {
    flex: 1,
    marginVertical: 2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    backgroundColor: 'white',
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DBDBDB',
  },
  leftBlock: {
    margin: 15,
  },
  middleBlock: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  image: {
    width: Dimensions.get('window').width / 7,
    height: Dimensions.get('window').width / 7,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16,
    color: '#212121',
  },
  subtitile: {
    fontSize: 12,
    color: '#9E9E9E',
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

  renderNoNotifications() {
    return (<View style={styles.body}>
      <Text>{I18n.t('no-notifications-yet')}</Text>
    </View>);
  }

  renderNotification() {
    return (<TouchableHighlight
      onPress={() => Actions.result({
        history: this.props.history,
        isSearch: false,
        isGotoResult: true,
      })}
      underlayColor="white"
    >
      <View style={styles.cell}>
        <View style={styles.leftBlock}>
          <Image
            style={styles.image}
            source={[
              { uri: this.props.history.url },
              // { uri: this.props.history.original_uri },
            ]}
          />
        </View>
        <View style={styles.middleBlock}>
          <Text style={styles.title}>{I18n.t('notification-title')}</Text>
          <Text style={styles.subtitile}>{(this.props.history.modified_datetime && moment(this.props.history.modified_datetime).format('LLL')) || ''}</Text>
        </View>
      </View>
    </TouchableHighlight>);
  }

  render() {
    if (this.props.isNotification) {
      return (
        <View style={styles.container}>
          {this.renderToolbar()}
          {this.renderNotification()}
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        {this.renderNoNotifications()}
      </View>
    );
  }
}

NotificationView.propTypes = {
  title: React.PropTypes.string,
  history: React.PropTypes.shape({
    // id: React.PropTypes.string,
    url: React.PropTypes.string,
    // user_id: React.PropTypes.string,
    // original_uri: React.PropTypes.string,
    // created_datetime: React.PropTypes.string,
    modified_datetime: React.PropTypes.string,
  }),
  isNotification: React.PropTypes.bool,
};

NotificationView.defaultProps = {
  title: '',
  history: {},
  isNotification: false,
};
