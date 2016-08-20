import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import ImageResizer from 'react-native-image-resizer';  // eslint-disable-line import/no-unresolved
import SafariView from 'react-native-safari-view';

import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies

import * as api from '../api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    resizeMode: 'cover',
  },
});

export default class ResultView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const that = this;
    ImageResizer.createResizedImage(this.props.image, 600, 600, 'JPEG', 40).then((resizedImageUri) => {
      Reactotron.log({ log: 'Image resized', resizedImageUri });

      api.craftarSearch(resizedImageUri)
      .then((response) => response.json())
      .then((json) => {
        Reactotron.log({ log: 'Craftar search', json });

        if (json.results.length && json.results.length > 0) {
          if (json.results[0].item && json.results[0].item.url) {
            that.setState({
              name: json.results[0].item.name,
              url: json.results[0].item.url,
            });
          }
        }
      })
      .catch((error) => {
        Reactotron.log({ error });
      });
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
        <Image
          style={styles.image}
          source={{ uri: this.props.image }}
        />
        {this.state.name && <Text style={styles.button}>
          {this.state.name}
        </Text>}
        {this.state.url && <TouchableHighlight onPress={() => this.openUrl(this.state.url)} underlayColor="white">
          <Text style={styles.button}>
            {this.state.url}
          </Text>
        </TouchableHighlight>}
      </View>
    );
  }
}

ResultView.propTypes = {
  image: React.PropTypes.string,
};

ResultView.defaultProps = {
};
