import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import firebase from 'firebase';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { Button, CheckBox, FormLabel, FormInput } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import NavigationBar from 'react-native-navbar';

import { config } from '../config';
import commonStyle from '../utils/common-styles';
import I18n from '../utils/i18n';

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
  body: {
    flex: 1,
    backgroundColor: 'white',
    padding: 30,
  },
  cell: {
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
  image: {
    width: Dimensions.get('window').width / 5,
    height: Dimensions.get('window').width / 5,
    resizeMode: 'cover',
  },
  title: {
    paddingLeft: 20,
    fontSize: 16,
    color: '#212121',
  },
  button: {
    marginVertical: 5,
  },
}));

export default class ResultFeedbackView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answer: null,
      other: '',
    };
  }

  componentDidMount() {
    this.checkTag(this.props.history.id);
  }

  checkTag(imageId) {
    console.log('checkTag', imageId);
    const that = this;
    const ref = firebase.database().ref(`results/${imageId}/tag`);
    ref.on('value', (snapshot) => {
      if (snapshot) {
        const value = snapshot.val();
        if (value && value.length > 0) {
          console.log('Check tag', value);
          that.setState({ tags: value.map(item => Object.assign({ checked: true }, item)) });
        }
      }
    });
  }

  toggleTag(toggleItem) {
    console.log(toggleItem);
    const tempTags = this.state.tags.map(item => item.name === toggleItem.name ? Object.assign({}, item, { checked: !toggleItem.checked }) : item);  // eslint-disable-line no-confusing-arrow
    this.setState({ tags: tempTags });
  }

  sendGreatFeedback() {
    const form = new FormData();  // eslint-disable-line no-undef
    form.append('from', 'AnySnap User <user@anysnap.com>');
    form.append('to', 'tech@frontn.com');
    form.append('subject', 'AnySnap result feedback');
    form.append('text', `User thinks this is great.\n\n${JSON.stringify(this.props.history, null, 2)}`);

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

  sendResultFeedback() {
    const form = new FormData();  // eslint-disable-line no-undef
    form.append('from', 'AnySnap User <user@anysnap.com>');
    form.append('to', 'tech@frontn.com');
    form.append('subject', 'AnySnap result feedback');
    form.append('text', `User thinks it's "${this.state.answer}"
      the image is:
      ${JSON.stringify(this.props.history, null, 2)}

      the proper tags should be:
      ${JSON.stringify(this.state.tags, null, 2)}

      other: ${this.state.other}`);

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

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: '#4A4A4A' }}
          leftButton={<Icon
            style={styles.navigatorLeftButton}
            name="arrow-back"
            size={26}
            color="gray"
            onPress={Actions.pop}
          />}
          // rightButton={<Icon
          //   style={styles.navigatorRightButton}
          //   name="send"
          //   size={26}
          //   color="gray"
          //   onPress={Actions.pop}
          // />}
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
    const ANSWERS = [
      I18n.t('great'),
      I18n.t('could-be-better'),
      I18n.t('missed-the-point'),
      I18n.t('what-the-heck'),
    ];
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <ScrollView style={styles.body}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {this.props.history.url && <Image
              style={styles.image}
              source={[
                { uri: this.props.history.url },
                // { uri: this.props.history.original_uri },
              ]}
            />}

            <Text style={styles.title}>Tell AnySnap how it did:</Text>
          </View>

          <View style={{ marginVertical: 20, borderColor: '#BDBDBD', borderWidth: StyleSheet.hairlineWidth * 2 }} />

          {!this.state.answer && <View>
            <Button
              small
              buttonStyle={styles.button}
              title={ANSWERS[0]}
              backgroundColor="#2BBDC3"
              onPress={() => { this.setState({ answer: ANSWERS[0] }); this.sendGreatFeedback(); }}
            />
            <Button
              small
              buttonStyle={styles.button}
              title={ANSWERS[1]}
              backgroundColor="#2BBDC3"
              onPress={() => this.setState({ answer: ANSWERS[1] })}
            />
            <Button
              small
              buttonStyle={styles.button}
              title={ANSWERS[2]}
              backgroundColor="#2BBDC3"
              onPress={() => this.setState({ answer: ANSWERS[2] })}
            />
            <Button
              small
              buttonStyle={styles.button}
              title={ANSWERS[3]}
              backgroundColor="#2BBDC3"
              onPress={() => this.setState({ answer: ANSWERS[3] })}
            />
          </View>}

          {this.state.answer && <View>
            <Button
              small
              buttonStyle={styles.button}
              title={ANSWERS[0]}
              backgroundColor={this.state.answer === ANSWERS[0] ? '#9E9E9E' : '#BDBDBD'} onPress={() => this.setState({ answer: ANSWERS[0] })}
            />
            <Button
              small
              buttonStyle={styles.button}
              title={ANSWERS[1]}
              backgroundColor={this.state.answer === ANSWERS[1] ? '#9E9E9E' : '#BDBDBD'} onPress={() => this.setState({ answer: ANSWERS[1] })}
            />
            <Button
              small
              buttonStyle={styles.button}
              title={ANSWERS[2]}
              backgroundColor={this.state.answer === ANSWERS[2] ? '#9E9E9E' : '#BDBDBD'} onPress={() => this.setState({ answer: ANSWERS[2] })}
            />
            <Button
              small
              buttonStyle={styles.button}
              title={ANSWERS[3]}
              backgroundColor={this.state.answer === ANSWERS[3] ? '#9E9E9E' : '#BDBDBD'} onPress={() => this.setState({ answer: ANSWERS[3] })}
            />
          </View>}

          {this.state.answer === ANSWERS[0] && <Text style={[styles.titile, { textAlign: 'center', margin: 10 }]}>Thanks for your help!</Text>}

          {this.state.answer && this.state.answer !== ANSWERS[0] && <View style={{ marginVertical: 30 }}>
            <Text style={[styles.titile, { textAlign: 'center' }]}>{I18n.t('uncheck-those-not-accurate')}</Text>

            {this.state.tags && this.state.tags.map((item, i) =>
              <CheckBox key={i} title={item.name} checked={item.checked} onPress={() => this.toggleTag(item)} />
            )}

            <FormLabel>{I18n.t('other')}</FormLabel>
            <FormInput
              placeholder={I18n.t('type-better-identification')}
              onChangeText={other => this.setState({ other })}
            />
            <View style={{ height: 20 }} />

            <Button title={I18n.t('submit')} onPress={() => this.sendResultFeedback()} />
          </View>}
        </ScrollView>

        <KeyboardSpacer />
      </View>
    );
  }
}

ResultFeedbackView.propTypes = {
  title: React.PropTypes.string,
  history: React.PropTypes.shape({
    id: React.PropTypes.string,
    url: React.PropTypes.string,
    // user_id: React.PropTypes.string,
    // original_uri: React.PropTypes.string,
    // created_datetime: React.PropTypes.string,
    // modified_datetime: React.PropTypes.string,
  }),
};

ResultFeedbackView.defaultProps = {
  title: '',
  history: {},
  isNotification: false,
};
