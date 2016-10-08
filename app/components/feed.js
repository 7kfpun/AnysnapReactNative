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
import { ButtonGroup } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';
import NavigationBar from 'react-native-navbar';

import FeedCell from '../elements/feed-cell';

import commonStyle from '../utils/common-styles';
import I18n from '../utils/i18n';

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
      selectedIndex: 0,
      region: {
        latitude: 22.404145,
        longitude: 114.132056,
        latitudeDelta: 0.679708,
        longitudeDelta: 0.535344,
      },
      markers: [{
        coordinate: {
          latitude: 22.294685,
          longitude: 114.168999,
        },
        title: '誠品生活館',
        description: '誠品生活館, Hong Kong',
      }, {
        coordinate: {
          latitude: 22.2797338,
          longitude: 114.1863162,
        },
        title: '香港商務印書館',
        description: '香港商務印書館 - 銅鑼灣圖書中心',
      }],
    };
  }

  componentDidMount() {
    this.prepareRows();
  }

  prepareRows() {
    const that = this;
    const ref = firebase.database().ref('data');
    this.setState({ refreshing: true });

    ref.once('value')
      .then((snapshot) => {
        const value = snapshot.val();
        console.log('Feed', value);
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
        console.error(error);
        that.setState({
          loading: false,
          hasResult: false,
        });
      });

    this.setState({ refreshing: false });
  }

  onRegionChange(region) {
    console.log(region);
    this.setState({ region });
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

  renderFeed() {
    if (!this.state.data) {
      return (<ActivityIndicator animating={true} style={{ height: 60 }} size="small" />);
    }

    return (
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
        disableLeftSwipe={true}
        disableRightSwipe={true}
      />);
  }

  renderMap() {
    return (<MapView
      style={{ flex: 1 }}
      region={this.state.region}
      onRegionChange={region => this.onRegionChange(region)}
    >
      {this.state.markers.map((marker, i) => (
        <MapView.Marker
          coordinate={marker.coordinate}
          key={i}
          title={marker.title}
          description={marker.description}
        />
      ))}
    </MapView>);
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderToolbar()}

        <ButtonGroup
          onPress={selectedIndex => this.setState({ selectedIndex })}
          selectedIndex={this.state.selectedIndex}
          buttons={[I18n.t('feed'), I18n.t('map')]}
        />

        {this.state.selectedIndex === 0 && this.renderFeed()}
        {this.state.selectedIndex === 1 && this.renderMap()}
      </View>
    );
  }
}

FeedView.propTypes = {
  title: React.PropTypes.string,
};

FeedView.defaultProps = {
  title: '',
};
