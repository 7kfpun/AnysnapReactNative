import React, { Component } from 'react';
import {
  Image,
  Linking,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import SafariView from 'react-native-safari-view';  // eslint-disable-line import/no-unresolved

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DBDBDB',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    resizeMode: 'cover',
  },
  infomationBlock: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    color: '#212121',
  },
  subtitile: {
    fontSize: 12,
    color: '#9E9E9E',
  },
});

export default class FeedCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [''],
    };
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
    return (
      <TouchableHighlight
        onPress={() => this.props.data[0] && this.props.data[0].url && this.openUrl(this.props.data[0].url)}
        underlayColor="white"
      >
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={{ uri: this.props.data[0] && this.props.data[0].image }}
          />
          <View style={styles.infomationBlock}>
            <Text style={styles.title}>{(this.props.data[0] && this.props.data[0].name) || ''}</Text>
            <Text style={styles.subtitile}>{(this.props.data[0] && this.props.data[0].url) || ''}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

FeedCell.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.object),
};

FeedCell.defaultProps = {
  data: {},
  history: {},
};
