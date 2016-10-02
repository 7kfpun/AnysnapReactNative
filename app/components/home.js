import React, { Component } from 'react';
import {
  ImagePickerIOS,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';

import I18n from '../utils/i18n';

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
      console.log('Image picked', data);

      Actions.result({ image: data });
    }, err => console.error(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={() => Actions.camera()} underlayColor="white">
          <Text style={styles.button}>
            {I18n.t('camera')}
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.pickImage()} underlayColor="white">
          <Text style={styles.button}>
            {I18n.t('photo-library')}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}
