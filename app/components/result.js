import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import DeviceInfo from 'react-native-device-info';
import ImageResizer from 'react-native-image-resizer';  // eslint-disable-line import/no-unresolved
import RNFetchBlob from 'react-native-fetch-blob';
import SafariView from 'react-native-safari-view';  // eslint-disable-line import/no-unresolved
import Icon from 'react-native-vector-icons/MaterialIcons';

import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies

import firebase from 'firebase';

import TagCell from '../elements/tag-cell';

import * as api from '../api';
import I18n from '../utils/i18n';

import { config } from '../config';

const gcloudStorage = config.firebase.storageBucket;

const uniqueID = DeviceInfo.getUniqueID();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  navbar: {
    height: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    paddingLeft: 10,
  },
  navbarText: {
    paddingLeft: 5,
    color: '#212121',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    resizeMode: 'cover',
  },
  relatedImageGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  relatedImage: {
    width: (Dimensions.get('window').width / 3) - 30,
    height: (Dimensions.get('window').width / 3) - 30,
    resizeMode: 'cover',
  },
  tagsGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tag: {
    fontSize: 12,
    color: '#1E88E5',
  },
});

export default class ResultView extends Component {
  constructor(props) {
    super(props);

    let filename;
    if (this.props.image) {
      try {
        filename = /id=(.*)\&ext/i.exec(this.props.image)[0].replace('id=', '').replace('&ext', '');  // eslint-disable-line no-useless-escape
      } catch (err) {
        filename = this.props.image.replace(/^.*[\\\/]/, '').replace('.jpg', '');
      }
    }

    this.state = {
      filename,
      loading: true,
    };
  }

  componentDidMount() {
    // this.craftarSearch();
    // this.uploadImage();
  }

  craftarSearch() {
    const that = this;
    ImageResizer.createResizedImage(this.props.image, 600, 600, 'JPEG', 40).then((resizedImageUri) => {
      Reactotron.log({ log: 'Image resized', resizedImageUri });

      api.craftarSearch(resizedImageUri)
      .then((response) => response.json())
      .then((json) => {
        that.setState({ loading: false });
        Reactotron.log({ log: 'Craftar search', json });

        if (json.results && json.results.length > 0) {
          if (json.results[0].item && json.results[0].item.url) {
            that.setState({
              name: json.results[0].item.name,
              url: json.results[0].item.url,
            });
          }
        } else {
          that.setState({ empty: true });
        }

        firebase.database().ref(`app/img/${this.state.filename}/timestamp`).set(new Date().getTime());
        firebase.database().ref(`app/img/${this.state.filename}/uniqueID`).set(uniqueID);
        firebase.database().ref(`app/img/${this.state.filename}/original`).set(this.props.image);
        firebase.database().ref(`app/craftar/${this.state.filename}`).set(json);
      })
      .catch((error) => {
        Reactotron.log({ error });
      });
    });
  }

  uploadImage() {
    Reactotron.log(`https://www.googleapis.com/upload/storage/v1/b/${gcloudStorage}/o?uploadType=media&name=${this.state.filename}`);

    RNFetchBlob.fetch(
      'POST',
      `https://www.googleapis.com/upload/storage/v1/b/${gcloudStorage}/o?uploadType=media&name=${this.state.filename}`,
      {
        'Content-Type': 'image/jpeg',
      },
      RNFetchBlob.wrap(this.props.image)
    )
    .then((response) => response.json())
    .then((json) => {
      Reactotron.log({ log: 'Uploaded image', json });

      try {
        firebase.database().ref(`app/bucket/${this.state.filename}`).set(json);
      } catch (err) {
        console.warn(err);
      }
    })
    .catch((error) => {
      console.warn(error);
    });
  }

  openUrl(url) {
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

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />
        <View style={styles.navbar}>
          <Icon name="arrow-back" size={26} color="gray" />
          <Text style={styles.navbarText}>{I18n.t('more-information')}</Text>
        </View>
        <Image
          style={styles.image}
          source={{ uri: this.props.image || 'https://66.media.tumblr.com/730ada421683ce9980c04dcd765bdcb1/tumblr_o2cp9zi2EW1qzayuxo9_1280.jpg' }}
        />
        {this.state.loading && <Text style={styles.button}>
          Loading
        </Text>}
        {this.state.empty && <Text style={styles.button}>
          No result
        </Text>}

        {this.state.name && <Text style={styles.button}>
          {this.state.name}
        </Text>}
        {this.state.url && <TouchableHighlight onPress={() => this.openUrl(this.state.url)} underlayColor="white">
          <Text style={styles.button}>
            {this.state.url}
          </Text>
        </TouchableHighlight>}

        <Text>about AnySnap result</Text>
        <View style={styles.relatedImageGroup}>
          <Image
            style={styles.relatedImage}
            source={{ uri: this.props.image || 'https://66.media.tumblr.com/730ada421683ce9980c04dcd765bdcb1/tumblr_o2cp9zi2EW1qzayuxo9_1280.jpg' }}
          />
          <Image
            style={styles.relatedImage}
            source={{ uri: this.props.image || 'https://66.media.tumblr.com/730ada421683ce9980c04dcd765bdcb1/tumblr_o2cp9zi2EW1qzayuxo9_1280.jpg' }}
          />
          <Image
            style={styles.relatedImage}
            source={{ uri: this.props.image || 'https://66.media.tumblr.com/730ada421683ce9980c04dcd765bdcb1/tumblr_o2cp9zi2EW1qzayuxo9_1280.jpg' }}
          />
        </View>

        <Text>related result</Text>
        <View style={styles.tagsGroup}>
          <Icon style={{ marginRight: 2 }} name="local-offer" color="gray" size={12} />
          <Text style={styles.tag}>{'tag'}</Text><Text style={styles.comma}>{', '}</Text>
          <Text style={styles.tag}>{'tag'}</Text><Text style={styles.comma}>{', '}</Text>
          <Text style={styles.tag}>{'tag'}</Text><Text style={styles.comma}>{', '}</Text>
          <TagCell text="tag" />
        </View>
      </View>
    );
  }
}

ResultView.propTypes = {
  image: React.PropTypes.string,
};

ResultView.defaultProps = {
};
