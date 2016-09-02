import React, { Component } from 'react';
import {
  ListView,
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
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';

import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies

import HistoryCell from '../elements/history-cell';

const uniqueID = DeviceInfo.getUniqueID();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CEDADF',
    marginBottom: 50,
  },
  navigatorBarIOS: {
    backgroundColor: '#2BBDC3',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#00BFA5',
  },
  navigatorLeftButton: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 50,
  },
  navigatorRightButton: {
    paddingTop: 10,
    paddingLeft: 50,
    paddingRight: 10,
  },
  toolbar: {
    height: 56,
    backgroundColor: '#202020',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#E55356',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 28,
    marginBottom: 5,
  },
});

export default class HistoryView extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      ds,
      key: Math.random(),
      dataSource: ds.cloneWithRows([{}]),
      refreshing: false,
    };
  }

  componentDidMount() {
    this.prepareRows();
  }

  prepareRows() {
    const that = this;
    const ref = firebase.database().ref('app/img');
    this.setState({ refreshing: true });

    ref.orderByChild('uniqueID').equalTo(uniqueID).once('value')
      .then((snapshot) => {
        const value = snapshot.val();
        if (value) {
          let images = Object.keys(value).map((key) => Object.assign({ id: key }, value[key]));
          images = images.filter((item) => !item.isDeleted);
          images = _.sortBy(images, 'timestamp').reverse();
          Reactotron.log(images);

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
    return (
      <NavigationBar
        statusBar={{ tintColor: '#2BBDC3', style: 'light-content' }}
        style={styles.navigatorBarIOS}
        title={{ title: this.props.title, tintColor: 'white' }}
        rightButton={<Icon
          style={styles.navigatorRightButton}
          name="md-camera"
          size={24}
          color="white"
          onPress={Actions.camera}
        />}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <SwipeListView
          ref={(c) => { this.scrollView = c; }}
          key={this.state.key}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.prepareRows()}
            />
          }
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <HistoryCell history={rowData} />}
          renderHiddenRow={(data) => (
            <View style={styles.rowBack}>
              <View />
              <Icon name="ios-close" color="white" size={40} />
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
};

HistoryView.defaultProps = {
  title: '',
};
