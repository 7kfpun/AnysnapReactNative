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

export default class CraftarImagesCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
    };
  }

  openUrl(url) {
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
    const resultsLength = this.state.results.length;
    const maxLenght = 20;
    return (
      <View style={styles.container}>
        {this.props.results.map((item, i) => <View key={i} style={{ flexDirection: 'row' }}>
          <TouchableHighlight key={i} onPress={() => this.openUrl(item.payload && item.payload.item && item.payload.item.url)} underlayColor="white">
            <View style={styles.imageBlock}>
              <Image
                style={styles.image}
                source={{ uri: item.payload && item.payload.image && item.payload.image.thumb_120 }}  // eslint-disable-line global-require
              />
              {item.payload && item.payload.item && item.payload.item.name && <Text style={styles.text}>
                {item.payload.item.name && item.payload.item.name.length > maxLenght ? `${item.payload.item.name.substring(0, maxLenght - 3)}...`
                :
                item.payload.item.name}
              </Text>}
            </View>
          </TouchableHighlight>
          {i <= resultsLength + 1 ? <View style={styles.blank} /> : null}
        </View>
        )}
      </View>
    );
  }
}

CraftarImagesCell.propTypes = {
  results: React.PropTypes.arrayOf(React.PropTypes.object),
};

CraftarImagesCell.defaultProps = {
  results: [],
};
