import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageResizer from 'react-native-image-resizer';  // eslint-disable-line import/no-unresolved
import NavigationBar from 'react-native-navbar';
import SafariView from 'react-native-safari-view';  // eslint-disable-line import/no-unresolved
import Spinner from 'react-native-spinkit';

import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies

import TagsCell from '../elements/tags-cell';
import CraftarImagesCell from '../elements/craftar-images-cell';
import RelatedImagesCell from '../elements/related-images-cell';

import * as api from '../api';
import I18n from '../utils/i18n';

import commonStyle from '../utils/common-styles';

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
    fontSize: 12,
    color: '#212121',
  },
}));

export default class ResultView extends Component {
  constructor(props) {
    super(props);

    let filename;
    if (this.props.image) {
      try {
        filename = /id=(.*)\&ext/i.exec(this.props.image)[0].replace('id=', '').replace('&ext', '');  // eslint-disable-line no-useless-escape
      } catch (err) {
        filename = this.props.image.replace(/^.*[\\\/]/, '').replace('.jpg', '');
      }
    }

    this.state = {
      filename,
      // isLoading: true,
      isLoading: false,
      tags: this.props.tags || [],
    };
  }

  componentDidMount() {
    if (this.props.tags.length === 0) {
      this.craftarSearch();
      this.googleVision();
    }
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'History'
      Actions.history({ type: 'replace' });
    }
  }

  craftarSearch() {
    const that = this;
    ImageResizer.createResizedImage(this.props.image, 800, 800, 'JPEG', 60).then((resizedImageUri) => {
      Reactotron.log({ log: 'Image resized', resizedImageUri });

      api.craftarSearch(this.state.filename, resizedImageUri)
      .then((json) => {
        that.setState({ isLoading: false });

        if (json.results && json.results.length > 0) {
          if (json.results[0].item && json.results[0].item.url) {
            Reactotron.log({ log: 'Craftar matched', name: json.results[0].item.name });
            that.setState({
              name: json.results[0].item.name,
              url: json.results[0].item.url,
              key: Math.random(),
            });
          }
        }
      });
    });
  }

  googleVision() {
    Reactotron.log({ log: 'Upload image', filename: this.state.filename, image: this.props.image });
    api.uploadImage(this.state.filename, this.props.image)
    .then(() => {
      api.googleVision(this.state.filename)
      .then((json) => {
        Reactotron.log({ log: 'Google vision done', labelAnnotations: json.responses[0].labelAnnotations });
        const tags = json.responses[0].labelAnnotations.map(item => item.description);
        this.setState({ tags });
      });
    });
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
        .catch((err1) => {
          console.error('Cannot open url', err1);
        });
    }
  }

  renderLoading() {
    return (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Spinner style={styles.spinner} size={40} type="Pulse" color="#424242" />
    </View>);
  }

  renderResult() {
    return (
      <View style={styles.bottomBlock}>
        <Text style={styles.text}>{I18n.t('anysnap-results')}</Text>
        <ScrollView horizontal={true}>
          <CraftarImagesCell name={this.props.craftar || this.state.name} key={this.state.key} />
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
            name="inbox"
            size={26}
            color="gray"
            onPress={() => Actions.history({ type: 'replace' })}
          />}
          // rightButton={<Icon
          //   style={styles.navigatorRightButton}
          //   name="sms-failed"
          //   size={26}
          //   color="gray"
          // />}
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
          <Image
            style={styles.image}
            source={{ uri: this.props.image || 'https://66.media.tumblr.com/730ada421683ce9980c04dcd765bdcb1/tumblr_o2cp9zi2EW1qzayuxo9_1280.jpg' }}
          />

          {this.state.isLoading && this.renderLoading()}
          {!this.state.isLoading && this.renderResult()}
        </ScrollView>
      </View>
    );
  }
}

ResultView.propTypes = {
  title: React.PropTypes.string,
  image: React.PropTypes.string,
  tags: React.PropTypes.arrayOf(React.PropTypes.string),
  craftar: React.PropTypes.string,
};

ResultView.defaultProps = {
  tags: [],
};
