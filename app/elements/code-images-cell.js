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

export default class CodeImagesCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
    };
  }

  openUrl(query) {
    let url;
    if (query.startsWith('http')) {
      url = query;
    } else {
      url = `https://www.google.com/search?q=${query}`.replace(/\s/g, '+');
    }
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
    const maxLenght = 15;
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableHighlight onPress={() => this.openUrl(this.props.code.data)} underlayColor="white">
            <View style={styles.imageBlock}>
              <Image
                style={styles.image}
                source={{ url: 'https://firebasestorage.googleapis.com/v0/b/frontn-anysnap.appspot.com/o/app%2Fgoogle-search.png?alt=media&token=6306a8d5-d46d-4d2b-960a-7daec85379fd' }}
              />
              <Text style={styles.text}>
                {this.props.code.data.length > maxLenght ? `${this.props.code.data.substring(0, maxLenght - 3)}...`
                :
                this.props.code.data}
              </Text>
            </View>
          </TouchableHighlight>
          <View style={styles.blank} />
        </View>
      </View>
    );
  }
}

CodeImagesCell.propTypes = {
  code: React.PropTypes.shape({
    data: React.PropTypes.string,
    // type: React.PropTypes.string,
  }),
};

CodeImagesCell.defaultProps = {
  code: {},
};
