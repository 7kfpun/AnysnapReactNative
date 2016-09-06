import React, { Component } from 'react';
import {
  Linking,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

// 3rd party libraries
import Icon from 'react-native-vector-icons/MaterialIcons';
import SafariView from 'react-native-safari-view';  // eslint-disable-line import/no-unresolved

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    color: '#1E88E5',
  },
});

export default class TagsCell extends Component {
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
      <View style={styles.container}>
        <Icon style={{ marginRight: 2 }} name="local-offer" color="gray" size={12} />
        {this.props.tags.map((item, i) => <TouchableHighlight key={i} onPress={() => this.openUrl(item)} underlayColor="white">
          <Text style={styles.text}>{item}{tagsLength !== i + 1 ? ',' : ''}</Text>
        </TouchableHighlight>)}
      </View>
    );
  }
}

TagsCell.propTypes = {
  tags: React.PropTypes.array,
};

TagsCell.defaultProps = {
  tags: ['loading...'],
};
