import React, { Component } from 'react';
import {
  ImagePickerIOS,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import Reactotron from 'reactotron'; // eslint-disable-line import/no-extraneous-dependencies

// 3rd party libraries
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginBottom: 50,
  },
  button: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default class HomeView extends Component {
  pickImage() {
    ImagePickerIOS.openSelectDialog({}, (data) => {
      Reactotron.log({ log: 'Image picked', data });

      Actions.result({ image: data });
    }, (err) => Reactotron.log(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={() => Actions.camera()} underlayColor="white">
          <Text style={styles.button}>
            Camera
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.pickImage()} underlayColor="white">
          <Text style={styles.button}>
            Photo library
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}
