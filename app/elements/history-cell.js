import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import firebase from 'firebase';
import moment from 'moment';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import TagsCell from './tags-cell';

const styles = StyleSheet.create({
  container: {
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
  rightBlock: {
    justifyContent: 'center',
    marginRight: 10,
  },
  image: {
    width: Dimensions.get('window').width / 4,
    height: Dimensions.get('window').width / 4,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16,
    color: '#212121',
  },
  subtitile: {
    fontSize: 12,
    color: '#9E9E9E',
  },
});

export default class HistoryCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
    };
  }

  componentDidMount() {
    this.checkLogo();
    this.checkTag();
  }

  checkLogo() {
    const that = this;
    if (this.props.history.id) {
      const ref = firebase.database().ref(`results/${this.props.history.id}/logo`);
      ref.once('value').then((snapshot) => {
        if (snapshot) {
          const value = snapshot.val();
          if (value && value.length > 0) {
            console.log('Check logo', value);
            that.setState({ logo: value.map(item => item.name) });
          }
        }
      })
      .catch(err => console.error(err));
    }
  }

  checkTag() {
    const that = this;
    if (this.props.history.id) {
      const ref = firebase.database().ref(`results/${this.props.history.id}/tag`);
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
  }

  checkVision() {
    const that = this;
    if (this.props.history.id) {
      const ref = firebase.database().ref(`results/${this.props.history.id}/vision`);
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
  }

  render() {
    return (
      <TouchableHighlight
        onPress={() => Actions.result({
          // type: 'replace',
          history: this.props.history,
          isSearch: false,
        })}
        underlayColor="#EFEFF4"
      >
        <View style={styles.container}>
          <View style={styles.leftBlock}>
            <Image
              style={styles.image}
              source={[
                { uri: this.props.history.url },
                // { uri: this.props.history.original_uri },
              ]}
            />
          </View>
          <View style={styles.middleBlock}>
            <Text style={styles.title}>{
              this.state.name
              || (this.state.logo && this.state.logo.length > 0 && this.state.logo[0])
              || (this.state.tags && this.state.tags.length > 0 && this.state.tags[0])
              || ''}</Text>
            <Text style={styles.subtitile}>{(this.props.history.created_datetime && moment(this.props.history.created_datetime).format('LLL')) || ''}</Text>
            <TagsCell tags={this.state.tags} maximum={6} allowOpenUrl={false} />
          </View>
          <View style={styles.rightBlock}>
            <Icon name="keyboard-arrow-right" color="#D2DEE3" size={24} />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

HistoryCell.propTypes = {
  history: React.PropTypes.shape({
    id: React.PropTypes.string,
    url: React.PropTypes.string,
    // user_id: React.PropTypes.string,
    // original_uri: React.PropTypes.string,
    created_datetime: React.PropTypes.string,
    // modified_datetime: React.PropTypes.string,
  }),
};

HistoryCell.defaultProps = {
  history: {},
};
