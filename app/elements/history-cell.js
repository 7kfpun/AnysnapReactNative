import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import SafariView from 'react-native-safari-view';

import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies

import firebase from 'firebase';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 10,
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width / 2,
    resizeMode: 'cover',
  },
});

export default class HistoryCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{ uri: this.props.history.original }}
        />
        <View style={{ padding: 10 }}>
          {this.state.name && <Text>{this.state.name}</Text>}
          {this.state.url && <TouchableHighlight onPress={() => this.openUrl(this.state.url)} underlayColor="white">
            <Text>{this.state.url}</Text>
          </TouchableHighlight>}
        </View>
      </View>
    );
  }
}

HistoryCell.propTypes = {
  history: React.PropTypes.object,
};

HistoryCell.defaultProps = {
};
