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
import ActionSheet from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SafariView from 'react-native-safari-view';  // eslint-disable-line import/no-unresolved,import/extensions

import I18n from '../utils/i18n';

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
    alignItems: 'flex-end',
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
        .catch(err => console.error('Cannot open safari', err));
    } else if (Platform.OS === 'android') {
      Linking.openURL(url)
        .catch(err => console.error('Cannot open url', err));
    }
  }

  show() {
    this.ActionSheet.show();
  }

  render() {
    const actionOptions = [I18n.t('cancel'), I18n.t('it-should-not--be-on-anysnap'), I18n.t('its-spam')];
    const maxLenght = 50;

    return (
      <TouchableHighlight
        onPress={() => this.props.data[0] && this.props.data[0].url && this.openUrl(this.props.data[0].url)}
        underlayColor="white"
      >
        <View style={styles.container}>
          <ActionSheet
            ref={(o) => { this.ActionSheet = o; }}
            title={I18n.t('flag-title')}
            options={actionOptions}
            cancelButtonIndex={0}
          />
          <Image
            style={styles.image}
            source={{ uri: this.props.data[0] && this.props.data[0].image }}
          >
            <Icon
              style={{ margin: 12, backgroundColor: 'transparent' }}
              name="flag"
              size={20}
              color="white"
              onPress={() => this.show()}
            />
          </Image>
          <View style={styles.infomationBlock}>
            <Text style={styles.title}>{(this.props.data[0] && this.props.data[0].name) || ''}</Text>
            <Text style={styles.subtitile}>{
              (this.props.data[0] && this.props.data[0].url && this.props.data[0].url.length > maxLenght ? `${this.props.data[0].url.substring(0, maxLenght - 3)}...` : this.props.data[0].url)
              || ''}</Text>
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
