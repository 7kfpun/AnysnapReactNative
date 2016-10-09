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
import moment from 'moment';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { RNS3 } from 'react-native-aws3';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageResizer from 'react-native-image-resizer';  // eslint-disable-line import/no-unresolved,import/extensions
import NavigationBar from 'react-native-navbar';
import Spinner from 'react-native-spinkit';
import store from 'react-native-simple-store';

import TagsCell from '../elements/tags-cell';
import CodeImagesCell from '../elements/code-images-cell';
import CraftarImagesCell from '../elements/craftar-images-cell';
import LogoImagesCell from '../elements/logo-images-cell';
import RelatedImagesCell from '../elements/related-images-cell';

import * as api from '../api';
import { config } from '../config';
import commonStyle from '../utils/common-styles';
import I18n from '../utils/i18n';

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 50,
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  spinner: {
    margin: 50,
  },
  bottomBlock: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    justifyContent: 'space-around',
  },
  text: {
    fontSize: 14,
    color: '#212121',
  },
  moreResultsComing: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    margin: 10,
    padding: 20,
  },
}));

export default class ResultView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // isLoading: true,
      isLoading: false,
    };
  }

  componentDidMount() {
    if (this.props.image && this.props.isSearch === true) {
      // this.craftarSearch();
      // this.googleVision();
      const that = this;
      store.get('UNIQUEID').then((uniqueID) => {
        if (uniqueID) {
          that.uploadImage(that.props.image, uniqueID);
        }
      });
    } else {
      this.checkCraftar(this.props.history.id);
      this.checkLogo(this.props.history.id);
      this.checkTag(this.props.history.id);
    }
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'History'
      Actions.history();
    }
  }

  uploadImage(image, uniqueID) {
    let filename;
    try {
      filename = /id=(.*)\&ext/i.exec(image)[0].replace('id=', '').replace('&ext', '');  // eslint-disable-line no-useless-escape
    } catch (err) {
      filename = image.replace(/^.*[\\\/]/, '').replace('.jpg', '');
    }

    console.log('this.state.UNIQUEID', this.state.UNIQUEID);
    const options = Object.assign(config.s3, { keyPrefix: `uploads/${uniqueID}/` });

    const that = this;
    ImageResizer.createResizedImage(image, 1200, 1200, 'JPEG', 40).then((resizedImageUri) => {
      console.log('resizedImageUri', resizedImageUri);
      const file = {
        uri: resizedImageUri,
        name: `${filename}.jpg`,
        type: 'image/jpg',
      };

      RNS3.put(file, options).then((response) => {
        if (response.status !== 201) {
          console.log(response);
          throw new Error('Failed to upload image to S3');
        }
        console.log('S3 uploaded', response.body);
        if (response.body.postResponse && response.body.postResponse.location) {
          api.createUserImage(response.body.postResponse.location.replace(/%2F/g, '/'), image, uniqueID).then((json) => {
            console.log('createUserImage', json);
            that.setState({ status: 'DONE' });
            try {
              that.checkCraftar(json.results[0].id);
              that.checkLogo(json.results[0].id);
              that.checkTag(json.results[0].id);
            } catch (err) {
              console.error(err);
            }
          });
        }
      })
      .progress((e) => {
        console.log(e.loaded / e.total);
        if (e.loaded / e.total < 1) {
          that.setState({ status: 'UPLOADING' });
        } else if (e.loaded / e.total === 1) {
          that.setState({ status: 'UPLOADED' });
          console.log('Image uploaded');
        }
      });
    }).catch((err) => {
      console.log('ImageResizer', err);
    });
  }

  checkCraftar(imageId) {
    console.log('checkLogo', imageId);
    const that = this;
    const ref = firebase.database().ref(`results/${imageId}/recognition`);
    ref.on('value', (snapshot) => {
      if (snapshot) {
        const value = snapshot.val();
        if (value && value.length > 0) {
          console.log('Check craftar', value);
          that.setState({ craftar: value });
        }
      }
    });
  }

  checkLogo(imageId) {
    console.log('checkLogo', imageId);
    const that = this;
    const ref = firebase.database().ref(`results/${imageId}/logo`);
    ref.on('value', (snapshot) => {
      if (snapshot) {
        const value = snapshot.val();
        if (value && value.length > 0) {
          console.log('Check logo', value);
          that.setState({ logo: value.map(item => item.name) });
        }
      }
    });
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
          that.setState({ tags: value.map(item => item.name) });
        }
      }
    });
  }

  renderLoading() {
    return (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Spinner style={styles.spinner} size={40} type="Pulse" color="#424242" />
    </View>);
  }

  renderMoreResultsComing() {
    if (this.props.image || (this.props.history && this.props.history.created_datetime && moment().diff(moment(this.props.history.created_datetime), 'minutes') < 60)) {
      return (<View style={styles.moreResultsComing}>
        <Text style={[styles.text, { color: 'white' }]}>{I18n.t('would-notice-when-more-results')}</Text>
      </View>);
    }
  }

  renderResult() {
    return (
      <View style={styles.bottomBlock}>
        <Text style={styles.text}>{I18n.t('anysnap-results')}</Text>

        <ScrollView horizontal={true}>
          {this.props.code && this.props.code.data && <CodeImagesCell code={this.props.code} />}
          {this.state.craftar && <CraftarImagesCell results={this.state.craftar} />}
          {this.state.logo && <LogoImagesCell results={this.state.logo} />}
          <RelatedImagesCell tags={this.state.tags} />
        </ScrollView>

        <TagsCell tags={this.state.tags} />
      </View>
    );
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ tintColor: 'white', style: 'default' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: '#4A4A4A' }}
          leftButton={<Icon
            style={styles.navigatorLeftButton}
            name="arrow-back"
            size={26}
            color="gray"
            // onPress={() => Actions.history({ type: 'replace' })}
            onPress={() => Actions.pop()}
          />}
          rightButton={<Icon
            style={styles.navigatorRightButton}
            name="announcement"
            size={26}
            color="gray"
            onPress={() => Actions.resultFeedback({
              history: this.props.history,
            })}
          />}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="#4A4A4A"
          actions={[
            { title: I18n.t('history'), iconName: 'inbox', iconSize: 26, show: 'always' },
          ]}
          onActionSelected={position => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderToolbar()}

        <ScrollView>
          {(this.props.history.url || this.props.image) && <Image
            style={styles.image}
            source={[
              { uri: this.props.history.url || this.props.image },
              // { uri: this.props.history.original_uri },
            ]}
          >
            {this.renderMoreResultsComing()}
          </Image>}

          {this.state.isLoading && this.renderLoading()}
          {!this.state.isLoading && this.renderResult()}
        </ScrollView>
      </View>
    );
  }
}

ResultView.propTypes = {
  title: React.PropTypes.string,
  isSearch: React.PropTypes.bool,
  image: React.PropTypes.string,
  history: React.PropTypes.shape({
    id: React.PropTypes.string,
    url: React.PropTypes.string,
    // user_id: React.PropTypes.string,
    // original_uri: React.PropTypes.string,
    created_datetime: React.PropTypes.string,
    // modified_datetime: React.PropTypes.string,
  }),
  code: React.PropTypes.shape({
    type: React.PropTypes.string,
    data: React.PropTypes.string,
  }),
};

ResultView.defaultProps = {
  title: '',
  isSearch: true,
  history: {},
};
