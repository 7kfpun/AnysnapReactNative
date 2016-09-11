import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import SafariView from 'react-native-safari-view';  // eslint-disable-line import/no-unresolved
import Spinner from 'react-native-spinkit';

const BLANK_WIDTH = 30;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  image: {
    width: (Dimensions.get('window').width / 3) - BLANK_WIDTH,
    height: (Dimensions.get('window').width / 3) - BLANK_WIDTH,
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
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').width / 3) - BLANK_WIDTH,
  },
  blank: {
    width: BLANK_WIDTH,
  },
  text: {
    color: '#9E9E9E',
    fontSize: 10,
  },
});

export default class RelatedImagesCell extends Component {
  openUrl(query) {
    const url = `https://www.google.com/search?q=${query}`;
    if (Platform.OS === 'ios') {
      SafariView.isAvailable()
        .then(SafariView.show({ url }))
        .catch(err => {
          console.error('Cannot open safari', err);
        });
    } else if (Platform.OS === 'android') {
      Linking.openURL(url)
        .catch(err1 => {
          console.error('Cannot open url', err1);
        });
    }
  }

  render() {
    const tagsLength = this.props.tags.length;
    return (
      <ScrollView style={styles.container} horizontal={true}>
        {this.props.tags.length === 0 && <View style={styles.imageLoading}>
          <Spinner style={styles.spinner} size={40} type="Bounce" color="#7F7F7F" />
          <Spinner style={styles.spinner} size={40} type="Bounce" color="#7F7F7F" />
          <Spinner style={styles.spinner} size={40} type="Bounce" color="#7F7F7F" />
        </View>}
        {this.props.tags.map((item, i) => <View key={i} style={{ flexDirection: 'row' }}>
          <TouchableHighlight key={i} onPress={() => this.openUrl(item)} underlayColor="white">
            <View style={styles.imageBlock}>
              <Image
                style={styles.image}
                source={require('../../assets/google.png')}  // eslint-disable-line global-require
              />
              <Text style={styles.text}>{item}</Text>
            </View>
          </TouchableHighlight>
          {tagsLength !== i + 1 ? <View style={styles.blank} /> : null}
        </View>
        )}
      </ScrollView>
    );
  }
}

RelatedImagesCell.propTypes = {
  tags: React.PropTypes.arrayOf(React.PropTypes.string),
};

RelatedImagesCell.defaultProps = {
  tags: ['loading...'],
};
