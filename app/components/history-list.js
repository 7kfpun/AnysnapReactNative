import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ListView,
  Platform,
  TouchableHighlight,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { Button } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';

import HistoryCell from '../elements/history-cell';

import * as api from '../api';
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

export default class HistoryListView extends Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });

    this.state = {
      key: Math.random(),
      dataSource: this.dataSource.cloneWithRows([]),
      refreshing: false,
    };
  }

  componentWillMount() {
    if (this.props.isGotoResult) {
      Actions.result({
        image: this.props.image,
        history: this.props.history,
        isSearch: this.props.isSearch,
        code: this.props.code,
        // type: 'replace',
      });
    }
  }

  componentDidMount() {
    this.prepareRows();
  }

  prepareRows() {
    const that = this;
    this.setState({ refreshing: true });
    store.get('UNIQUEID').then((uniqueID) => {
      if (uniqueID) {
        api.getUserImages(uniqueID)
        .then((json) => {
          that.setState({ refreshing: false });

          if (json && json.results && json.results.length > 0) {
            that.setState({
              images: json.results,
              dataSource: this.dataSource.cloneWithRows(json.results),
              key: Math.random(),
            });
          } else {
            that.setState({ isNothing: true });
          }
        });
      }
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

  renderNothing() {
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            style={{
              width: Dimensions.get('window').width / 2,
              height: Dimensions.get('window').width / 2,
              resizeMode: 'cover',
            }}
            source={require('../../assets/images/no-photo.png')}
          />

          <Text>Nothing here!</Text>
          <Text>Take any thing, dont leave it emtry.</Text>

          <Button borderRadius={30} title="TAKE A PHOTO" onPress={Actions.pop} />
        </View>
      </View>
    );
  }

  render() {
    if (this.state.isNothing) {
      return this.renderNothing();
    }

    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        {!this.state.images && <ActivityIndicator
          animating={true}
          style={{ height: 60 }}
          size="small"
        />}
        <SwipeListView
          // ref={(c) => { this.scrollView = c; }}
          // key={this.state.key}
          style={{ marginTop: 2 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.prepareRows()}
            />
          }
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          renderRow={rowData => <HistoryCell history={rowData} />}
          renderHiddenRow={rowData => <TouchableHighlight
            style={styles.rowBack}
            onPress={() => {
              console.log(rowData);
              api.deleteUserImage(rowData.id, rowData.user_id)
                .then((json) => {
                  const that = this;
                  if (json.results === 'success') {
                    that.prepareRows();
                  }
                });
            }}
            underlayColor="#E57373"
          >
            <View style={styles.rowBackBlock}>
              <Icon name="close" color="white" size={30} />
            </View>
          </TouchableHighlight>
          }
          rightOpenValue={-75}
          disableRightSwipe={true}
        />
      </View>
    );
  }
}

HistoryListView.propTypes = {
  title: React.PropTypes.string,
  image: React.PropTypes.string,
  isSearch: React.PropTypes.bool,
  isGotoResult: React.PropTypes.bool,
  history: React.PropTypes.shape({}),
  code: React.PropTypes.shape({}),
};

HistoryListView.defaultProps = {
  title: '',
  image: '',
  isSearch: false,
  isGotoResult: false,
};
