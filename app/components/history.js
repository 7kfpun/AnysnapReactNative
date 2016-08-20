import React, { Component } from 'react';
import {
  ListView,
  StyleSheet,
  RefreshControl,
  View,
} from 'react-native';

import _ from 'underscore';
import firebase from 'firebase';

// 3rd party libraries
import DeviceInfo from 'react-native-device-info';

import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies

import HistoryCell from '../elements/history-cell';

const uniqueID = DeviceInfo.getUniqueID();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: 60,
    marginBottom: 50,
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

  render() {
    return (
      <View style={styles.container}>
        <ListView
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
        />
      </View>
    );
  }
}
