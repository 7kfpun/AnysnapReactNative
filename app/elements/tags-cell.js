import React, { Component } from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import Icon from 'react-native-vector-icons/MaterialIcons';
import SafariView from 'react-native-safari-view';  // eslint-disable-line import/no-unresolved,import/extensions
import Spinner from 'react-native-spinkit';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
  },
  text: {
    fontSize: 12,
    color: '#1E88E5',
    marginBottom: 2,
  },
});

export default class TagsCell extends Component {
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
    const tagsLength = Math.min(this.props.tags.length, this.props.maximum);
    console.log('tagsLength', this.props.tags.length, this.props.maximum, tagsLength);
    return (
      <View style={styles.container}>
        <Icon style={{ marginRight: 2 }} name="label-outline" color="#7F7F7F" size={12} />
        {(!this.props.tags || this.props.tags.length === 0) && <Spinner style={styles.spinner} size={14} type="ThreeBounce" color="#7F7F7F" />}
        {this.props.tags.slice(0, this.props.maximum).map((item, i) => <TouchableHighlight key={i} onPress={() => this.openUrl(item)} underlayColor="white">
          <Text style={styles.text}>{item}{i + 1 < tagsLength ? ', ' : ''}</Text>
        </TouchableHighlight>)}
      </View>
    );
  }
}

TagsCell.propTypes = {
  tags: React.PropTypes.arrayOf(React.PropTypes.string),
  maximum: React.PropTypes.number,
};

TagsCell.defaultProps = {
  tags: [],
  maximum: 20,
};
