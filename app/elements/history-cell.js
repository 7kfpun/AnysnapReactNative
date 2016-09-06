import React, { Component } from 'react';
import {
  Image,
  Linking,
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

import TagsCell from './tags-cell';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftBlock: {
    margin: 20,
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
    width: 60,
    height: 60,
    borderRadius: 30,
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
      tags: ['tag0', 'tag1', 'tag2'],
    };
  }

  componentDidMount() {
    const that = this;
    if (this.props.history.id) {
      const ref = firebase.database().ref(`app/craftar/${this.props.history.id}`);
      ref.once('value').then((snapshot) => {
        if (snapshot) {
          const value = snapshot.val();
          if (value.results && value.results.length > 0) {
            if (value.results[0].item && value.results[0].item.url) {
              that.setState({
                name: value.results[0].item.name,
                url: value.results[0].item.url,
              });
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
      <TouchableHighlight onPress={() => Actions.historyDetail({ history: this.props.history })} underlayColor="white">
        <View style={styles.container}>
          <View style={styles.leftBlock}>
            <Image
              style={styles.image}
              source={{ uri: this.props.history.original }}
            />
          </View>
          <View style={styles.middleBlock}>
            <Text style={styles.title}>{this.state.name || 'NAME'}</Text>
            {<TouchableHighlight onPress={() => this.state.url && this.openUrl(this.state.url)} underlayColor="white">
              <Text style={styles.subtitile}>{this.state.url || 'URL'}</Text>
            </TouchableHighlight>}

            <TagsCell tags={this.state.tags} />
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
