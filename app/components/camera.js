import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import Button from 'apsl-react-native-button';
import Camera from 'react-native-camera';  // eslint-disable-line import/no-named-as-default,import/no-named-as-default-member
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';

import commonStyle from '../utils/common-styles';

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
  container: {
    flex: 1,
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
  snapBlock: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  footerBlock: {
    height: 40,
    flexDirection: 'row',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 20,
    height: 30,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: '#CCCCCC',
  },
  selectedFooterButton: {
    borderBottomWidth: StyleSheet.hairlineWidth * 4,
  },
}));

export default class CameraView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFlashOn: false,
      isCameraFront: false,
      isIntroDone: false,
      selectedFeature: 'book',
    };

    console.log('commonStyle', commonStyle);
  }

  componentDidMount() {
    store.get('isIntroDone')
      .then((isIntroDone) => {
        if (!isIntroDone) {
          Actions.intro();
        }
      });
  }

  takePicture() {
    this.camera.capture().then((data) => {
      console.log('Camera captured', data);

      Actions.tabbar({ image: data.path, isSearch: true });
    })
    .catch(err => console.error(err));
  }

  pickImage() {
    ImagePicker.launchImageLibrary({}, (response) => {
      console.log('ImagePicker', response);
      if (response && response.uri) {
        // Actions.result({ image: response.uri });
        const uri = Platform.OS === 'ios' ? response.uri.replace('file://', '') : response.uri;
        Actions.tabbar({ image: uri, isSearch: true });
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
            <Icon style={{ paddingVertical: 20, paddingRight: 20 }} name="collections" size={22} color="#9E9E9E" onPress={() => this.pickImage()} />
            {/* <Icon name="photo-camera" style={styles.capture} size={52} color="white" onPress={() => this.askPermission('camera')} /> */}
            <TouchableHighlight onPress={() => this.askPermission('camera')} underlayColor="white">
              <Image
                style={{
                  width: Math.min(Dimensions.get('window').width / 4, 110),
                  height: Math.min(Dimensions.get('window').width / 4, 110),
                  resizeMode: 'cover',
                }}
                source={require('../../assets/images/capture-button.png')}
              />
            </TouchableHighlight>
            <Icon style={{ paddingVertical: 20, paddingLeft: 20 }} name="inbox" size={22} color="#9E9E9E" onPress={Actions.tabbar} />
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
            <Icon
              style={{ paddingTop: 20, paddingRight: 20 }}
              name={this.state.isFlashOn ? 'flash-on' : 'flash-off'}
              size={22}
              color="white"
              onPress={() => this.setState({ isFlashOn: !this.state.isFlashOn })}
            />
            <Icon
              style={{ paddingTop: 20, paddingLeft: 20 }}
              name={this.state.isCameraFront ? 'camera-front' : 'camera-rear'}
              size={22}
              color="white"
              onPress={() => this.setState({ isCameraFront: !this.state.isCameraFront })}
            />
          </View>
        </Camera>}

        <View style={styles.snapBlock}>
          <Icon style={{ paddingVertical: 20, paddingRight: 20 }} name="collections" size={22} color="#9E9E9E" onPress={() => this.pickImage()} />
          {/* <Icon style={{ padding: 0 }} name="radio-button-checked" size={120} color="#9E9E9E" onPress={() => this.takePicture()} /> */}
          <TouchableHighlight onPress={() => this.takePicture()} underlayColor="white">
            <Image
              style={{
                width: Math.min(Dimensions.get('window').width / 4, 110),
                height: Math.min(Dimensions.get('window').width / 4, 110),
                resizeMode: 'cover',
              }}
              source={require('../../assets/images/capture-button.png')}
            />
          </TouchableHighlight>
          <Icon style={{ paddingVertical: 20, paddingLeft: 20 }} name="inbox" size={22} color="#9E9E9E" onPress={Actions.tabbar} />
        </View>
        <View style={styles.footerBlock}>
          <Button
            style={[styles.footerButton, this.state.selectedFeature === 'book' ? styles.selectedFooterButton : null]}
            onPress={() => this.setState({ selectedFeature: 'book' })}
            textStyle={{ fontSize: 10 }}
          >
            {'BOOK COVER'}
          </Button>
          <Button
            style={[styles.footerButton, this.state.selectedFeature === 'search' ? styles.selectedFooterButton : null]}
            onPress={() => this.setState({ selectedFeature: 'search' })}
            textStyle={{ fontSize: 10 }}
          >
            {'SEARCH '}
          </Button>
          <Button
            style={[styles.footerButton, this.state.selectedFeature === 'codescan' ? styles.selectedFooterButton : null]}
            onPress={() => this.setState({ selectedFeature: 'codescan' })}
            textStyle={{ fontSize: 10 }}
          >
            {'CODE SCAN'}
          </Button>
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
