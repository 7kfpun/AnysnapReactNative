import React, { Component } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import NavigationBar from 'react-native-navbar';

import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies

import I18n from '../utils/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  preview: {
    justifyContent: 'flex-end',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
  },
  cameraOptionBlock: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
  },
  footerBlock: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
});

export default class CameraView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFlashOn: false,
      isCameraFront: false,
    };
  }

  takePicture() {
    this.camera.capture().then((data) => {
      Reactotron.log({ log: 'Camera captured', data });

      Actions.tabbar({ image: data.path, newImage: true });
    })
    .catch(err => Reactotron.log(err));
  }

  pickImage() {
    ImagePicker.launchImageLibrary({}, (response) => {
      Reactotron.log({ log: 'ImagePicker', response });
      if (response && response.uri) {
        // Actions.result({ image: response.uri });
        const uri = Platform.OS === 'ios' ? response.uri.replace('file://', '') : response.uri;
        Actions.tabbar({ image: uri, newImage: true });
      }
    });
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ tintColor: 'white', style: 'default' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: '#4A4A4A' }}
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

        {this.state.permission === 'CAMERA-DENIED' && <View style={styles.preview}>
          <View style={styles.cameraIcons}>
            <TouchableHighlight onPress={() => this.pickImage()} underlayColor="black">
              <View style={styles.library}>
                <Icon name="photo-library" size={26} color="white" />
                <Text style={styles.text}>{I18n.t('photo-library')}</Text>
              </View>
            </TouchableHighlight>

            <Icon name="photo-camera" style={styles.capture} size={52} color="white" onPress={() => this.askPermission('camera')} />

            <TouchableHighlight onPress={() => Actions.timeline()} underlayColor="black">
              <View style={styles.moreButton}>
                <Icon name="format-list-bulleted" size={26} color="white" />
                <Text style={styles.text}>{I18n.t('photo-library')}</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>}

        {this.state.permission !== 'CAMERA-DENIED' && <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          captureAudio={false}
          aspect={Camera.constants.Aspect.fill}
          captureTarget={Camera.constants.CaptureTarget.temp}
          // onBarCodeRead={data => this.onBarCodeRead(data)}
          flashMode={this.state.isFlashOn ? Camera.constants.FlashMode.on : Camera.constants.FlashMode.off}
          type={this.state.isCameraFront ? Camera.constants.Type.front : Camera.constants.Type.back}
        >
          <View style={styles.cameraOptionBlock}>
            <Icon name={this.state.isFlashOn ? 'flash-off' : 'flash-on'} size={24} color="#9E9E9E" onPress={() => this.setState({ isFlashOn: !this.state.isFlashOn })} />
            <Icon name={this.state.isCameraFront ? 'camera-rear' : 'camera-front'} size={24} color="#9E9E9E" onPress={() => this.setState({ isCameraFront: !this.state.isCameraFront })} />
          </View>
        </Camera>}

        <View style={styles.footerBlock}>
          <Icon name="collections" size={24} color="#9E9E9E" onPress={() => this.pickImage()} />
          <Icon name="radio-button-checked" size={80} color="#9E9E9E" onPress={() => this.takePicture()} />
          <Icon name="timeline" size={24} color="#9E9E9E" onPress={() => Actions.tabbar()} />
        </View>
      </View>
    );
  }
}

CameraView.propTypes = {
  title: React.PropTypes.string,
};

CameraView.defaultProps = {
  title: '',
};
