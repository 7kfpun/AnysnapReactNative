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
      thumbnailUrl: 'https://www.safmarine.com/assets/saf/img/assets/lazyload.gif',
      hostPageUrl: 'https://www.safmarine.com/assets/saf/img/assets/lazyload.gif',
    };
  }

  componentDidMount() {
    this.bingImageSearch(this.props.text);
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
  text: React.PropTypes.string,
  style: React.PropTypes.number,
};

LogoImagesCell.defaultProps = {
  text: '',
};
