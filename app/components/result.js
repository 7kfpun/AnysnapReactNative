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
  ScrollView,
} from 'react-native';

// 3rd party libraries
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageResizer from 'react-native-image-resizer';  // eslint-disable-line import/no-unresolved
import SafariView from 'react-native-safari-view';  // eslint-disable-line import/no-unresolved
import Spinner from 'react-native-spinkit';

import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies

import firebase from 'firebase';

import TagsCell from '../elements/tags-cell';
import RelatedImagesCell from '../elements/related-images-cell';

import * as api from '../api';
import I18n from '../utils/i18n';

const uniqueID = DeviceInfo.getUniqueID();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 50,
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
  spinner: {
    margin: 50,
  },
  bottomBlock: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 5,
    justifyContent: 'space-around',
  },
  text: {
    fontSize: 12,
    color: '#212121',
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
      // isLoading: true,
      isLoading: false,
      tags: ['tag0', 'tag1', 'tag2', 'tag3'],
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
        that.setState({ isLoading: false });
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
    Reactotron.log('Upload image');
    api.uploadImage(this.state.filename, this.props.image);
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

  renderLoading() {
    return (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Spinner style={styles.spinner} size={40} type={'Pulse'} color={'#424242'} />
    </View>);
  }

  renderResult() {
    return (
      <View style={styles.bottomBlock}>
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

        <Text style={styles.text}>about AnySnap result</Text>
        <RelatedImagesCell tags={this.state.tags} />

        <Text style={styles.text}>related result</Text>
        <TagsCell tags={this.state.tags} />
      </View>
    );
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

        {this.state.isLoading && this.renderLoading()}
        {!this.state.isLoading && this.renderResult()}
      </View>
    );
  }
}

ResultView.propTypes = {
  image: React.PropTypes.string,
};

ResultView.defaultProps = {
};
