import React, { Component } from 'react';
import {
  Dimensions,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// 3rd party libraries
import SafariView from 'react-native-safari-view';  // eslint-disable-line import/no-unresolved,import/extensions
import Spinner from 'react-native-spinkit';

import ImageCell from './image-cell';

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

export default class RelatedImagesCell extends Component {
  openUrl(query) {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
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
    const resultsLength = this.props.tags.length;
    const maxLenght = 20;
    return (
      <View style={styles.container}>
        {this.props.tags.length === 0 && <View style={styles.imageLoading}>
          <Spinner style={styles.spinner} size={40} type="Bounce" color="#7F7F7F" />
          <Spinner style={styles.spinner} size={40} type="Bounce" color="#7F7F7F" />
          <Spinner style={styles.spinner} size={40} type="Bounce" color="#7F7F7F" />
        </View>}
        {this.props.tags.map((item, i) => <View key={i} style={{ flexDirection: 'row' }}>
          <View style={styles.imageBlock}>
            <ImageCell
              cellType="related"
              style={styles.image}
              text={item}
            />
            <Text style={styles.text}>{item && item.length > maxLenght ? `${item.substring(0, maxLenght - 3)}...` : item}</Text>
          </View>
          {i <= resultsLength ? <View style={styles.blank} /> : null}
        </View>
        )}
      </View>
    );
  }
}

RelatedImagesCell.propTypes = {
  tags: React.PropTypes.arrayOf(React.PropTypes.string),
};

RelatedImagesCell.defaultProps = {
  tags: [],
};
