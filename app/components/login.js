import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

import ApslButton from 'apsl-react-native-button';
import I18n from '../utils/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingLeft: 8,
  },
  cannotLogin: {
    fontSize: 14,
    color: 'black',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    height: 60,
    borderRadius: 0,
    borderWidth: 0,
    margin: 10,
  },
  buttonText: {
    fontSize: 14,
  },
});

export default class LoginView extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder={I18n.t('username')}
          onChangeText={(name) => this.setState({ name })}
          value={this.state.name}
        />

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder={I18n.t('password')}
          onChangeText={(name) => this.setState({ name })}
          value={this.state.name}
        />

        <TouchableHighlight onPress={() => this.openUrl(this.state.url)} underlayColor="white">
          <Text style={styles.cannotLogin}>
            {'CAN\'T LOGIN?'}
          </Text>
        </TouchableHighlight>

        <View style={styles.buttonGroup}>
          <ApslButton
            style={[styles.button, { backgroundColor: 'white', marginLeft: 20 }]}
            textStyle={[styles.buttonText, { color: 'black' }]}
            onPress={() => this.setState({ isLoading: true })}
            isLoading={this.state.isLoading}
            isDisabled={this.state.isLoading}
            activityIndicatorColor="white"
          >SIGN UP</ApslButton>
          <ApslButton
            style={[styles.button, { backgroundColor: '#2BBDC3', marginRight: 20 }]}
            textStyle={[styles.buttonText, { color: 'white' }]}
            onPress={() => this.setState({ isLoading: true })}
            isLoading={this.state.isLoading}
            isDisabled={this.state.isLoading}
            activityIndicatorColor="white"
          >LOGIN</ApslButton>
        </View>
      </View>
    );
  }
}
