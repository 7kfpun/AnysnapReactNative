import React, { Component } from 'react';
import {
  ActivityIndicator,
  ListView,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import _ from 'lodash';  // eslint-disable-line import/no-extraneous-dependencies
import firebase from 'firebase';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';

import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies

import FeedCell from '../elements/feed-cell';

import commonStyle from '../utils/common-styles';

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

export default class FeedView extends Component {
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
    const ref = firebase.database().ref('data');
    this.setState({ refreshing: true });

    ref.once('value')
      .then((snapshot) => {
        const value = snapshot.val();
        Reactotron.log({ log: 'Feed', value });
        if (value) {
          let data = _.values(value);
          data = _.shuffle(data);
          that.setState({
            data,
            dataSource: this.state.dataSource.cloneWithRows(data),
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
        {!this.state.data && <ActivityIndicator
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
          renderRow={rowData => <FeedCell data={rowData} />}
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

FeedView.propTypes = {
  title: React.PropTypes.string,
  image: React.PropTypes.string,
  newImage: React.PropTypes.bool,
};

FeedView.defaultProps = {
  title: '',
  image: '',
  newImage: false,
};
