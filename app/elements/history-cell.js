import React, { Component } from 'react';
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import SafariView from 'react-native-safari-view';  // eslint-disable-line import/no-unresolved

import Icon from 'react-native-vector-icons/MaterialIcons';

import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies

import firebase from 'firebase';
import moment from 'moment';

import TagsCell from './tags-cell';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DBDBDB',
  },
  leftBlock: {
    margin: 15,
  },
  middleBlock: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightBlock: {
    justifyContent: 'center',
    marginRight: 10,
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'cover',
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

export default class HistoryCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [''],
    };
  }

  componentDidMount() {
    this.checkVision();
    // this.checkCrafh();
  }

  checkVision() {
    const that = this;
    if (this.props.history.id) {
      const ref = firebase.database().ref(`app/vision/${this.props.history.id}`);
      ref.once('value').then((snapshot) => {
        if (snapshot) {
          const value = snapshot.val();
          Reactotron.log({ log: 'Check vision', value });
          if (value.responses && value.responses.length > 0) {
            if (value.responses[0].labelAnnotations && value.responses[0].labelAnnotations.length > 0) {
              const tags = value.responses[0].labelAnnotations.map((item) => item.description);
              that.setState({ tags });
            }
          }
        }
      })
      .catch((error) => {
        Reactotron.log(error);
      });
    }
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
        onPress={() => Actions.result({
          image: this.props.history.bucket && this.props.history.bucket.mediaLink,
          tags: this.state.tags,
        })}
        underlayColor="white"
      >
        <View style={styles.container}>
          <View style={styles.leftBlock}>
            <Image
              style={styles.image}
              source={{ uri: this.props.history.bucket && this.props.history.bucket.mediaLink }}
            />
          </View>
          <View style={styles.middleBlock}>
            <Text style={styles.title}>{(this.state.tags.length > 0 && this.state.tags[0]) || ''}</Text>
            <Text style={styles.subtitile}>{(this.props.history.timestamp && moment(this.props.history.timestamp).format('LLL')) || ''}</Text>
            <TagsCell tags={this.state.tags} maximum={8} />
          </View>
          <View style={styles.rightBlock}>
            <Icon name="keyboard-arrow-right" color="gray" size={24} />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

HistoryCell.propTypes = {
  history: React.PropTypes.object,
};

HistoryCell.defaultProps = {
  history: {},
};
