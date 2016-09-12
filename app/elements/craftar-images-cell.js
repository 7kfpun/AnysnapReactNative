import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import SafariView from 'react-native-safari-view';  // eslint-disable-line import/no-unresolved

import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies

import firebase from 'firebase';

const BLANK_WIDTH = 10;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 5,
  },
  image: {
    width: ((Dimensions.get('window').width - 20) - (2 * BLANK_WIDTH)) / 3,
    height: ((Dimensions.get('window').width - 20) - (2 * BLANK_WIDTH)) / 3,
    resizeMode: 'cover',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DBDBDB',
  },
  imageBlock: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLoading: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: Dimensions.get('window').width - 20,
    height: ((Dimensions.get('window').width - 20) - (2 * BLANK_WIDTH)) / 3,
  },
  blank: {
    width: BLANK_WIDTH,
  },
  text: {
    color: '#9E9E9E',
    fontSize: 10,
    lineHeight: 15,
  },
});

export default class CraftarImagesCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
    };
  }

  componentDidMount() {
    const that = this;
    if (this.props.name) {
      const ref = firebase.database().ref(`data/${this.props.name}`);
      ref.once('value').then((snapshot) => {
        if (snapshot) {
          const value = snapshot.val();
          Reactotron.log({ log: 'Check data', value });
          that.setState({ results: value });
        }
      })
      .catch((error) => {
        Reactotron.log(error);
      });
    }
  }

  openUrl(url) {
    if (Platform.OS === 'ios') {
      SafariView.isAvailable()
        .then(SafariView.show({ url }))
        .catch((err) => {
          console.error('Cannot open safari', err);
        });
    } else if (Platform.OS === 'android') {
      Linking.openURL(url)
        .catch((err) => {
          console.error('Cannot open url', err);
        });
    }
  }

  render() {
    const tagsLength = this.state.results.length;
    const maxLenght = 12;
    return (
      <View style={styles.container}>
        {this.state.results.map((item, i) => <View key={i} style={{ flexDirection: 'row' }}>
          <TouchableHighlight key={i} onPress={() => this.openUrl(item.url)} underlayColor="white">
            <View style={styles.imageBlock}>
              <Image
                style={styles.image}
                source={{ uri: item.image }}  // eslint-disable-line global-require
              />
              <Text style={styles.text}>{item.name && item.name.length > maxLenght ? `${item.name.substring(0, maxLenght - 3)}...` : item.name}</Text>
            </View>
          </TouchableHighlight>
          {tagsLength !== i ? <View style={styles.blank} /> : null}
        </View>
        )}
      </View>
    );
  }
}

CraftarImagesCell.propTypes = {
  name: React.PropTypes.string,
};

CraftarImagesCell.defaultProps = {};
