import React, { Component } from 'react';
import {
  ActivityIndicator,
  ListView,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import _ from 'underscore';
import firebase from 'firebase';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { SwipeListView } from 'react-native-swipe-list-view';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';

import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies

import HistoryCell from '../elements/history-cell';

import commonStyle from '../utils/common-styles';
import I18n from '../utils/i18n';

const uniqueID = DeviceInfo.getUniqueID();

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
    backgroundColor: '#E55356',
  },
  rowBackBlock: {
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default class HistoryView extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      ds,
      key: Math.random(),
      dataSource: ds.cloneWithRows([]),
      refreshing: false,
    };
  }

  componentDidMount() {
    if (this.props.image && this.props.newImage) {
      Actions.result({ image: this.props.image, type: 'replace' });
    }

    this.prepareRows();
  }

  prepareRows() {
    const that = this;
    const ref = firebase.database().ref('app/image');
    this.setState({ refreshing: true });

    ref.orderByChild('uniqueID').equalTo(uniqueID).once('value')
      .then((snapshot) => {
        const value = snapshot.val();
        Reactotron.log({ log: 'Firebase', value });
        if (value) {
          let images = Object.keys(value).map((key) => Object.assign({ id: key }, value[key]));
          images = images.filter((item) => !item.isDeleted);
          images = _.sortBy(images, 'timestamp').reverse();

          that.setState({
            images,
            dataSource: this.state.dataSource.cloneWithRows(images),
            key: Math.random(),
          });
        }
      })
      .catch((error) => {
        Reactotron.log(error);
        that.setState({
          loading: false,
          hasResult: false,
        });
      });

    this.setState({ refreshing: false });
  }

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
        {!this.state.images && <ActivityIndicator
          animating={true}
          style={{ height: 60 }}
          size="small"
        />}
        <SwipeListView
          ref={(c) => { this.scrollView = c; }}
          key={this.state.key}
          style={{ marginTop: 2 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.prepareRows()}
            />
          }
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          renderRow={(rowData) => <HistoryCell history={rowData} />}
          renderHiddenRow={() => (
            <View style={styles.rowBack}>
              <View style={styles.rowBackBlock}>
                <Icon name="close" color="white" size={30} />
              </View>
            </View>
          )}
          rightOpenValue={-75}
          disableRightSwipe={true}
        />
      </View>
    );
  }
}

HistoryView.propTypes = {
  title: React.PropTypes.string,
  image: React.PropTypes.string,
  newImage: React.PropTypes.bool,
};

HistoryView.defaultProps = {
  title: '',
  image: '',
  newImage: false,
};
