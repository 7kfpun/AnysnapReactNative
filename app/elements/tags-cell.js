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
import SafariView from 'react-native-safari-view';  // eslint-disable-line import/no-unresolved
import Spinner from 'react-native-spinkit';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    color: '#1E88E5',
    marginBottom: 2,
  },
});

export default class TagsCell extends Component {
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
      <View style={styles.container}>
        <Icon style={{ marginRight: 2 }} name="label-outline" color="#7F7F7F" size={12} />
        {this.props.tags.length === 0 && <Spinner style={styles.spinner} size={14} type="ThreeBounce" color="#7F7F7F" />}
        {this.props.tags.map((item, i) => <TouchableHighlight key={i} onPress={() => this.openUrl(item)} underlayColor="white">
          <Text style={styles.text}>{item}{tagsLength !== i + 1 ? ', ' : ''}</Text>
        </TouchableHighlight>)}
      </View>
    );
  }
}

TagsCell.propTypes = {
  tags: React.PropTypes.array,
};

TagsCell.defaultProps = {
  tags: [],
};
