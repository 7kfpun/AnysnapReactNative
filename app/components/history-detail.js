import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';

import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CEDADF',
  },
  navigatorBarIOS: {
    backgroundColor: '#2BBDC3',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#00BFA5',
  },
  navigatorLeftButton: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 50,
  },
  navigatorRightButton: {
    paddingTop: 10,
    paddingLeft: 50,
    paddingRight: 10,
  },
  toolbar: {
    height: 56,
    backgroundColor: '#202020',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
});

export default class HistoryDetailView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: Math.random(),
      refreshing: false,
    };
  }

  componentDidMount() {

  }

  renderToolbar() {
    return (
      <NavigationBar
        statusBar={{ tintColor: '#2BBDC3', style: 'light-content' }}
        style={styles.navigatorBarIOS}
        title={{ title: this.props.title, tintColor: 'white' }}
        rightButton={<Icon
          style={styles.navigatorRightButton}
          name="md-camera"
          size={24}
          color="white"
          onPress={Actions.camera}
        />}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderToolbar()}

        <Image
          style={styles.image}
          source={{ uri: this.props.history.original }}
        />
      </View>
    );
  }
}

HistoryDetailView.propTypes = {
  history: React.PropTypes.object,
  title: React.PropTypes.string,
};

HistoryDetailView.defaultProps = {
  history: {},
  title: '',
};
