import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ImagePickerIOS,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import ImageResizer from 'react-native-image-resizer';  // eslint-disable-line import/no-unresolved

import Reactotron from 'reactotron'; // eslint-disable-line import/no-extraneous-dependencies

import I18n from '../utils/i18n';

import * as api from '../api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginBottom: 50,
  },
  image: {
    width: (Dimensions.get('window').width / 4) - 1.5,
    height: (Dimensions.get('window').width / 4) - 1.5,
    resizeMode: 'cover',
    margin: 0.5,
  },
  button: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default class AdminView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pickedImages: [],
    };
  }

  pickImage() {
    ImagePickerIOS.openSelectDialog({}, (data) => {
      Reactotron.log({ log: 'Image picked', data });

      if (!this.state.pickedImages.includes(data)) {
        this.state.pickedImages.push(data);
        this.setState({ pickedImages: this.state.pickedImages });
      }
    }, err => Reactotron.log(err));
  }

  uploadPickedImages() {
    // const that = this;

    this.state.pickedImages.forEach((value) => {
      Reactotron.log({ log: 'CraftarCreateImage', resource_uri: 'response.resource_uri', value });
      ImageResizer.createResizedImage(value, 600, 600, 'JPEG', 40).then((resizedImageUri) => {
        Reactotron.log({ log: 'Image resized', resizedImageUri });

        api.craftarCreateImage('response.resource_uri', resizedImageUri);
      });
    });

    // if (this.state.pickedImages.length > 0 && this.state.name && this.state.url) {
    //   Reactotron.log({ log: 'CraftarCreateItem', name: this.state.name, url: this.state.url });
    //   api.craftarCreateItem(this.state.name, this.state.url)
    //   .then((response) => {
    //     Reactotron.log(response);
    //     if (response.error && response.error.code && response.error.message) {
    //       Alert.alert(
    //         response.error.code,
    //         JSON.stringify(response.error.details),
    //         [
    //           { text: 'OK', onPress: () => console.log('OK Pressed') },
    //         ]
    //       );
    //     } else if (response.name && response.url && response.uuid) {
    //       this.state.pickedImages.forEach((value) => {
    //         Reactotron.log({ log: 'CraftarCreateImage', resource_uri: response.resource_uri, value });
    //         api.craftarCreateImage(response.resource_uri, value);
    //       });
    //     }
    //   });
    // }
  }

  renderPickedImages() {
    if (this.state.pickedImages.length > 0) {
      const rows = [];

      this.state.pickedImages.forEach((value) => {
        rows.push(<Image
          key={value}
          style={styles.image}
          source={{ uri: value }}
        />);
      });

      return rows;
    }

    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{this.renderPickedImages()}</View>

        <TouchableHighlight onPress={() => this.pickImage()} underlayColor="white">
          <Text style={styles.button}>
            {I18n.t('admin-pick-image')}
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.setState({ pickedImages: [] })} underlayColor="white">
          <Text style={styles.button}>
            {I18n.t('admin-remove-all')}
          </Text>
        </TouchableHighlight>

        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, paddingLeft: 8 }}
          autoCapitalize="none"
          placeholder="Name"
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />

        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, paddingLeft: 8 }}
          autoCapitalize="none"
          placeholder="Url"
          onChangeText={url => this.setState({ url })}
          value={this.state.url}
        />

        <TouchableHighlight onPress={() => this.uploadPickedImages()} underlayColor="white">
          <Text style={styles.button}>
            {I18n.t('admin-confirm')}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}
