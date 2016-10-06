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
import SafariView from 'react-native-safari-view';  // eslint-disable-line import/no-unresolved,import/extensions

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

export default class LogoImagesCell extends Component {
  openUrl(query) {
    const url = `https://www.google.com/search?q=${query}`.replace(/\s/g, '+');
    if (Platform.OS === 'ios') {
      SafariView.isAvailable()
        .then(SafariView.show({ url }))
        .catch(err => console.error('Cannot open safari', err));
    } else if (Platform.OS === 'android') {
      Linking.openURL(url)
        .catch(err => console.error('Cannot open url', err));
    }
  }

  render() {
    const logosLength = this.props.logos.length;
    const maxLenght = 15;
    return (
      <View style={styles.container}>
        {this.props.logos.map((item, i) => <View key={i} style={{ flexDirection: 'row' }}>
          <TouchableHighlight key={i} onPress={() => this.openUrl(item)} underlayColor="white">
            <View style={styles.imageBlock}>
              <Image
                style={styles.image}
                source={require('../../assets/google.png')}  // eslint-disable-line global-require
              />
              <Text style={styles.text}>{item && item.length > maxLenght ? `${item.substring(0, maxLenght - 3)}...` : item}</Text>
            </View>
          </TouchableHighlight>
          {logosLength !== i ? <View style={styles.blank} /> : null}
        </View>
        )}
      </View>
    );
  }
}

LogoImagesCell.propTypes = {
  logos: React.PropTypes.arrayOf(React.PropTypes.string),
};

LogoImagesCell.defaultProps = {
  logos: [],
};
