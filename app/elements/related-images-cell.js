import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  TouchableHighlight,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
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
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                style={styles.image}
                source={{ uri: 'https://66.media.tumblr.com/730ada421683ce9980c04dcd765bdcb1/tumblr_o2cp9zi2EW1qzayuxo9_1280.jpg' }}
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
  tags: React.PropTypes.array,
};

RelatedImagesCell.defaultProps = {
  tags: ['loading...'],
};
