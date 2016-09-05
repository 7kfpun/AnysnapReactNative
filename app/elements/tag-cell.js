import React, { Component } from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';

// 3rd party libraries
import SafariView from 'react-native-safari-view';  // eslint-disable-line import/no-unresolved

const styles = StyleSheet.create({
  tag: {
    fontSize: 12,
    color: '#1E88E5',
  },
});

export default class TagCell extends Component {
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
    return (
      <TouchableHighlight onPress={() => this.openUrl(this.props.text)} underlayColor="white">
        <Text style={styles.tag}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

TagCell.propTypes = {
  text: React.PropTypes.string,
};

TagCell.defaultProps = {
  text: '',
};
