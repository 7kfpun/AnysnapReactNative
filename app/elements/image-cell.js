import React, { Component } from 'react';
import {
  Image,
  Linking,
  Platform,
  TouchableHighlight,
} from 'react-native';

// 3rd party libraries
import SafariView from 'react-native-safari-view';  // eslint-disable-line import/no-unresolved,import/extensions

import * as api from '../api';

export default class LogoImagesCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/frontn-anysnap.appspot.com/o/app%2Floading.gif?alt=media&token=d598952d-66ae-453f-b5ca-c6a9906b2252',
      hostPageUrl: 'https://www.google.com',
    };
  }

  componentDidMount() {
    if (this.props.cellType === 'logo') {
      this.bingImageSearch(this.props.text);
    }

    if (this.props.cellType === 'related') {
      // this.googleSearch(this.props.text);
      this.setState({
        thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/frontn-anysnap.appspot.com/o/app%2Fgoogle-search.png?alt=media&token=6306a8d5-d46d-4d2b-960a-7daec85379fd',
      });
    }
  }

  bingImageSearch(query) {
    const that = this;
    api.bingImageSearch(query)
    .then((json) => {
      if (json.value && json.value.length > 0) {
        console.log(json.value[0].thumbnailUrl);
        that.setState({
          thumbnailUrl: json.value[0].thumbnailUrl,
          hostPageUrl: json.value[0].hostPageUrl,
        });
      }
    });
  }

  googleSearch(query) {
    const that = this;
    that.setState({
      hostPageUrl: `https://www.google.com/search?q=${query}`.replace(/\s/g, '+'),
    });

    api.googleSearch(query.replace(/\s/g, '+'))
    .then((json) => {
      console.log('googleSearchgoogleSearch', json);
      if (json.items && json.items.length > 0) {
        that.setState({
          thumbnailUrl: (json.items[0].pagemap.cse_thumbnail && json.items[0].pagemap.cse_thumbnail[0].src)
            || (json.items[0].pagemap.cse_image && json.items[0].pagemap.cse_image[0].src)
            || 'https://firebasestorage.googleapis.com/v0/b/frontn-anysnap.appspot.com/o/app%2Fgoogle-search.png?alt=media&token=6306a8d5-d46d-4d2b-960a-7daec85379fd',
        });
      } else {
        that.setState({
          thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/frontn-anysnap.appspot.com/o/app%2Fgoogle-search.png?alt=media&token=6306a8d5-d46d-4d2b-960a-7daec85379fd',
        });
      }
    });
  }

  openUrl(url) {
    if (Platform.OS === 'ios') {
      SafariView.isAvailable()
        .then(SafariView.show({ url }))
        .catch(err => console.error('Cannot open safari', err));
    } else if (Platform.OS === 'android') {
      Linking.openURL(url)
        .catch(err => console.error('Cannot open url', err));
    }
  }

  render() {
    return (
      <TouchableHighlight onPress={() => this.openUrl(this.state.hostPageUrl)} underlayColor="white">
        <Image
          style={this.props.style}
          source={{ url: this.state.thumbnailUrl }}
        />
      </TouchableHighlight>
    );
  }
}

LogoImagesCell.propTypes = {
  cellType: React.PropTypes.string,
  text: React.PropTypes.string,
  style: React.PropTypes.number,
};

LogoImagesCell.defaultProps = {
  text: '',
};
