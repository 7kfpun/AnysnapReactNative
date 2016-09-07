import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
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
import RelatedImagesCell from '../elements/related-images-cell';

import * as api from '../api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 50,
  },
  navigatorBarIOS: {
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DBDBDB',
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
    backgroundColor: 'white',
    elevation: 10,
  },
  navbar: {
    height: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    paddingLeft: 10,
  },
  navbarText: {
    paddingLeft: 5,
    color: '#212121',
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
    marginHorizontal: 15,
    marginVertical: 5,
    justifyContent: 'space-around',
  },
  text: {
    fontSize: 12,
    color: '#212121',
  },
});

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
      tags: [],
    };
  }

  componentDidMount() {
    if (this.props.image) {
      // this.craftarSearch();
      this.uploadImage();
    }
  }

  craftarSearch() {
    const that = this;
    ImageResizer.createResizedImage(this.props.image, 600, 600, 'JPEG', 40).then((resizedImageUri) => {
      Reactotron.log({ log: 'Image resized', resizedImageUri });

      api.craftarSearch(this.state.filename, resizedImageUri)
      .then((json) => {
        that.setState({ isLoading: false });

        if (json.results && json.results.length > 0) {
          if (json.results[0].item && json.results[0].item.url) {
            that.setState({
              name: json.results[0].item.name,
              url: json.results[0].item.url,
            });
          }
        } else {
          that.setState({ empty: true });
        }
      });
    });
  }

  uploadImage() {
    Reactotron.log({ log: 'Upload image', filename: this.state.filename, image: this.props.image });
    api.uploadImage(this.state.filename, this.props.image)
    .then(() => {
      api.googleVision(this.state.filename)
      .then((json) => {
        Reactotron.log({ log: 'Google vision done', labelAnnotations: json.responses[0].labelAnnotations });
        const tags = json.responses[0].labelAnnotations.map((item) => item.description);
        this.setState({ tags });
      });
    });
  }

  openUrl(url) {
    if (Platform.OS === 'ios') {
      SafariView.isAvailable()
        .then(SafariView.show({ url }))
        .catch(err => {
          console.error('Cannot open safari', err);
        });
    } else if (Platform.OS === 'android') {
      Linking.openURL(url)
        .catch(err1 => {
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
        {this.state.empty && <Text style={styles.button}>
          No result
        </Text>}

        {this.state.name && <Text style={styles.button}>
          {this.state.name}
        </Text>}
        {this.state.url && <TouchableHighlight onPress={() => this.openUrl(this.state.url)} underlayColor="white">
          <Text style={styles.button}>
            {this.state.url}
          </Text>
        </TouchableHighlight>}

        <Text style={styles.text}>about AnySnap result</Text>
        <RelatedImagesCell tags={this.state.tags} />

        <Text style={styles.text}>related result</Text>
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
            onPress={Actions.pop}
          />}
          rightButton={<Icon
            style={styles.navigatorRightButton}
            name="sms-failed"
            size={26}
            color="gray"
          />}
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
};

ResultView.defaultProps = {
  title: '',
};
