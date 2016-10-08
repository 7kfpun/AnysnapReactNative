import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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

export default class LogoImagesCell extends Component {
  render() {
    const resultsLength = this.props.results.length;
    const maxLenght = 15;
    return (
      <View style={styles.container}>
        {this.props.results.map((item, i) => <View key={i} style={{ flexDirection: 'row' }}>
          <View key={i} style={styles.imageBlock}>
            <ImageCell
              cellType="logo"
              style={styles.image}
              source={require('../../assets/google.png')}  // eslint-disable-line global-require
              text={item}
            />
            <Text style={styles.text}>{item && item.length > maxLenght ? `${item.substring(0, maxLenght - 3)}...` : item}</Text>
          </View>
          {i <= resultsLength + 1 ? <View style={styles.blank} /> : null}
        </View>
        )}
      </View>
    );
  }
}

LogoImagesCell.propTypes = {
  results: React.PropTypes.arrayOf(React.PropTypes.string),
};

LogoImagesCell.defaultProps = {
  results: [],
};
