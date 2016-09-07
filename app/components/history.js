import React, { Component } from 'react';
import {
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

import I18n from '../utils/i18n';

const uniqueID = DeviceInfo.getUniqueID();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CEDADF',
    marginBottom: 50,
  },
  navigatorBarIOS: {
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DBDBDB',
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
    backgroundColor: 'white',
    elevation: 10,
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

  onActionSelected(position) {
    if (position === 0) {  // index of 'Done'
      Actions.pop();
    }
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
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ tintColor: '#2BBDC3', style: 'light-content' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: '#4A4A4A' }}
          rightButton={<Icon
            style={styles.navigatorRightButton}
            name="timeline"
            size={24}
            color="#4A4A4A"
            onPress={Actions.pop}
          />}
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
              <Icon name="close" color="white" size={40} />
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
