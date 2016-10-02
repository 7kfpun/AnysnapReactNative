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
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
// import ZocialIcon from 'react-native-vector-icons/Zocial';

import { config } from '../config';
import commonStyle from '../utils/common-styles';
import I18n from '../utils/i18n';

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
  form: {
    backgroundColor: '#EFEFF4',
  },
}));

export default class FeedbackView extends Component {
  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ tintColor: 'white', style: 'default' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: '#4A4A4A' }}
          // rightButton={{
          //   title: I18n.t('cancel'),
          //   handler: Actions.pop,
          // }}
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
            formName="feedbackForm"

            style={styles.form}

            // openModal={(route) => {
            //   console.log(route);
            // }}

            clearOnClose={true}


            onValueChange={data => console.log(data)}

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
              subject: {
                title: 'Subject',
                validate: [{
                  validator: 'isLength',
                  arguments: [10, 256],
                  message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters',
                }],
              },
              body: {
                title: 'Body',
                validate: [],
              },
              emailAddress: {
                title: 'Email address',
                validate: [{
                  validator: 'isLength',
                  arguments: [6, 255],
                }, {
                  validator: 'isEmail',
                }],
              },
              // phoneNumber: {
              //   title: 'Phone number',
              //   validate: [{
              //     validator: 'isLength',
              //     arguments: [-1, 255],
              //   }, {
              //     validator: 'matches',
              //     arguments: /^\++[\-\s0-9]*$/,
              //     message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters',
              //   }],
              // },
            }}
          >

            <GiftedForm.SeparatorWidget />

            <GiftedForm.TextInputWidget
              name="subject"
              title={I18n.t('subject')}
              clearButtonMode="while-editing"
              image={<Icon style={{ marginLeft: 10 }} name="border-color" size={20} color="#616161" />}
            />
            <GiftedForm.TextAreaWidget
              name="body"
              clearButtonMode="while-editing"
              multiline={true}
              numberOfLines={4}
            />

            <GiftedForm.SeparatorWidget />

            <GiftedForm.TextInputWidget
              name="emailAddress"
              title={I18n.t('email-address')}
              placeholder="example@gmail.com"
              keyboardType="email-address"
              clearButtonMode="while-editing"
              autoCorrect={false}
              image={<Icon style={{ marginLeft: 10 }} name="email" size={20} color="#616161" />}
            />

            {/* <GiftedForm.TextInputWidget
              name="phoneNumber"
              title={I18n.t('phone-number')}
              placeholder="+852 8000 0000"
              keyboardType="email-address"
              clearButtonMode="while-editing"
              image={<Icon style={{ marginLeft: 10 }} name="email" size={20} color="#616161" />}
            /> */}

            <GiftedForm.SeparatorWidget />

            <GiftedForm.SubmitWidget
              // title={<ZocialIcon.Button backgroundColor="#527DBE" name="facebook" size={20} color="white">
              //   {I18n.t('login-facebook')}
              // </ZocialIcon.Button>}
              title={I18n.t('send')}
              widgetStyles={{
                submitButton: {
                  backgroundColor: '#2BBDC3',
                },
              }}
              onSubmit={(isValid, values) => {
                if (isValid === true) {
                  console.log('Send email', values);
                  // curl -s --user 'api:key-3ax6xnjp29jd6fds4gc373sgvjxteol0' \
                  // https://api.mailgun.net/v3/samples.mailgun.org/messages \
                  //  -F from='Excited User <excited@samples.mailgun.org>' \
                  //  -F to='devs@mailgun.net' \
                  //  -F subject='Hello' \
                  //  -F text='Testing some Mailgun awesomeness!'
                  const form = new FormData();  // eslint-disable-line no-undef
                  form.append('from', 'AnySnap User <user@anysnap.com>');
                  form.append('to', 'tech@frontn.com');
                  form.append('subject', values.subject);
                  form.append('text', `${values.body}\n\n\n${JSON.stringify(values)}`);

                  fetch(config.mailgun, {  // eslint-disable-line no-undef
                    method: 'POST',
                    headers: {
                      Accept: 'application/json, application/xml, text/plain, text/html, *.*',
                      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    },
                    body: form,
                  })
                  .then((data) => {
                    console.log('request succeeded with JSON response', data);
                    Actions.pop();
                  }).catch((error) => {
                    console.log('request failed', error);
                  });
                }
              }}
            />

            <GiftedForm.HiddenWidget name="device-manufacturer" value={DeviceInfo.getManufacturer()} />
            <GiftedForm.HiddenWidget name="device-model" value={DeviceInfo.getModel()} />
            <GiftedForm.HiddenWidget name="system-version" value={DeviceInfo.getSystemVersion()} />
            <GiftedForm.HiddenWidget name="bundle-id" value={DeviceInfo.getBundleId()} />
            <GiftedForm.HiddenWidget name="version" value={DeviceInfo.getVersion()} />
            <GiftedForm.HiddenWidget name="build-number" value={DeviceInfo.getBuildNumber()} />

            <GiftedForm.SeparatorWidget />
          </GiftedForm>
        </ScrollView>
      </View>
    );
  }
}

FeedbackView.propTypes = {
  title: React.PropTypes.string,
};

FeedbackView.defaultProps = {
  title: '',
};
