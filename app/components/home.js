import React, { Component } from 'react';
import {
  ImagePickerIOS,
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import Reactotron from 'reactotron'; // eslint-disable-line import/no-extraneous-dependencies

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import ImageResizer from 'react-native-image-resizer';  // eslint-disable-line import/no-unresolved
import SafariView from 'react-native-safari-view';

import * as api from '../api';

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

      ImageResizer.createResizedImage(data, 600, 600, 'JPEG', 40).then((resizedImageUri) => {
        Reactotron.log({ log: 'Image resized', resizedImageUri });

        api.craftarSearch(resizedImageUri)
        .then((response) => response.json())
        .then((json) => {
          Reactotron.log({ log: 'Craftar search', json });

          if (json.results.length && json.results.length > 0) {
            if (json.results[0].item && json.results[0].item.url) {
              const url = json.results[0].item.url;
              try {
                SafariView.isAvailable()
                  .then(SafariView.show({ url }))
                  .catch(err => {
                    console.error('Cannot open safari', err);
                  });
              } catch (err) {
                Linking.openURL(url)
                  .catch(err1 => {
                    console.error('Cannot open url', err1);
                  });
              }
            }
          }
        })
        .catch((error) => {
          Reactotron.log({ error });
        });
      });
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
