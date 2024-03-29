import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { GiftedForm } from 'react-native-gifted-form';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import ZocialIcon from 'react-native-vector-icons/Zocial';

import commonStyle from '../utils/common-styles';
import I18n from '../utils/i18n';

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4',
  },
  form: {
    backgroundColor: '#EFEFF4',
  },
}));

export default class LoginView extends Component {
  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ tintColor: 'white', style: 'default' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: '#4A4A4A' }}
          rightButton={{
            title: I18n.t('cancel'),
            handler: Actions.pop,
          }}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="#4A4A4A"
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderToolbar()}

        <ScrollView>
          <GiftedForm
            formName="signupForm"

            style={styles.form}

            openModal={(route) => {
              console.log(route);
            }}

            clearOnClose={false}

            defaults={{
              /*
              username: 'Farid',
              'gender{M}': true,
              password: 'abcdefg',
              country: 'FR',
              birthday: new Date(((new Date()).getFullYear() - 18)+''),
              */
            }}

            validators={{
              emailAddress: {
                title: 'Email address',
                validate: [{
                  validator: 'isLength',
                  arguments: [6, 255],
                }, {
                  validator: 'isEmail',
                }],
              },
              password: {
                title: 'Password',
                validate: [{
                  validator: 'isLength',
                  arguments: [6, 16],
                  message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters',
                }],
              },
            }}
          >

            <GiftedForm.SeparatorWidget />
            <GiftedForm.TextInputWidget
              name="emailAddress"
              title={I18n.t('email-address')}
              placeholder="example@gmail.com"
              keyboardType="email-address"
              clearButtonMode="while-editing"
              image={<Icon style={{ marginLeft: 10 }} name="email" size={20} color="#616161" />}
            />

            <GiftedForm.TextInputWidget
              name="password"
              title={I18n.t('password')}
              placeholder="******"
              clearButtonMode="while-editing"
              secureTextEntry={true}
              image={<Icon style={{ marginLeft: 10 }} name="lock-outline" size={20} color="#616161" />}
            />

            <GiftedForm.SeparatorWidget />

            <GiftedForm.SubmitWidget
              title={<ZocialIcon.Button backgroundColor="#527DBE" name="facebook" size={20} color="white">
                {I18n.t('login-facebook')}
              </ZocialIcon.Button>}
              // title={I18n.t('login-facebook')}
              widgetStyles={{
                submitButton: {
                  backgroundColor: '#527DBE',
                },
              }}
              onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {  // eslint-disable-line no-unused-vars
                console.log(values);
                console.log(values);
                if (isValid === true) {
                  console.log('Is valid');
                }
              }}
            />

            <GiftedForm.SubmitWidget
              title={<ZocialIcon.Button backgroundColor="#DD4A37" name="google" size={20} color="white">
                {I18n.t('login-google')}
              </ZocialIcon.Button>}
              // title={I18n.t('login-google')}
              widgetStyles={{
                submitButton: {
                  backgroundColor: '#DD4A37',
                },
              }}
              onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {  // eslint-disable-line no-unused-vars
                console.log(values);
                if (isValid === true) {
                  console.log('Is valid');
                }
              }}
            />

            <GiftedForm.NoticeWidget
              title="By signing up, you agree to the Terms of Service and Privacy Policity."
            />

            <GiftedForm.HiddenWidget name="tos" value={true} />

            <GiftedForm.SeparatorWidget />
          </GiftedForm>
        </ScrollView>
      </View>
    );
  }
}

LoginView.propTypes = {
  title: React.PropTypes.string,
};

LoginView.defaultProps = {
  title: '',
};
