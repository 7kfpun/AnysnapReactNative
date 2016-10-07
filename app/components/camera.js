import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import _ from 'lodash';  // eslint-disable-line import/no-extraneous-dependencies
import { connect } from 'react-redux';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import Button from 'apsl-react-native-button';
import Camera from 'react-native-camera';  // eslint-disable-line import/no-named-as-default,import/no-named-as-default-member
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';
import timer from 'react-native-timer';

import commonStyle from '../utils/common-styles';

import { increaseAction, decreaseAction } from '../actions/counter';

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
  codeDetect: {
    color: 'white',
    fontSize: 12,
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

class CameraView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFlashOn: false,
      isCameraFront: false,
      isIntroDone: false,
      selectedFeature: 'book',
      code: {},
    };

    console.log('commonStyle', commonStyle);

    this.onBarCodeRead = _.throttle(this.onBarCodeRead, 5000);
  }

  componentDidMount() {
    // store.get('isIntroDone')
    //   .then((isIntroDone) => {
    //     if (!isIntroDone) {
    //       Actions.intro();
    //     }
    //   });
  }

  onBarCodeRead(data) {
    console.log(data);

    if (data.type === 'org.gs1.EAN-13' && data.data) {
      // Actions.tabbar({ code: response.data, isSearch: true, isGotoResult: true });
      this.setState({ code: Object.assign({}, data, { type: 'EAN-13' }) });
    }

    timer.setTimeout(this, 'name', () => this.setState({ code: {} }), 3000);
  }

  takePicture() {
    this.camera.capture().then((response) => {
      console.log('Camera captured', response);
      if (response && response.path) {
        Actions.tabbar({ image: response.path, isSearch: true, isGotoResult: true, code: this.state.code });
      }
    })
    .catch(err => console.error(err));
  }

  pickImage() {
    ImagePicker.launchImageLibrary({}, (response) => {
      console.log('ImagePicker', response);
      if (response && response.uri) {
        const uri = Platform.OS === 'ios' ? response.uri.replace('file://', '') : response.uri;
        Actions.tabbar({ image: uri, isSearch: true, isGotoResult: true });
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
    const { value, onIncreaseClick, onDecreaseClick } = this.props;

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
          // captureTarget={Camera.constants.CaptureTarget.cameraRoll}

          onBarCodeRead={this.onBarCodeRead.bind(this)}  // eslint-disable-line react/jsx-no-bind

          flashMode={this.state.isFlashOn ? Camera.constants.FlashMode.on : Camera.constants.FlashMode.off}
          type={this.state.isCameraFront ? Camera.constants.Type.front : Camera.constants.Type.back}
        >
          <View style={styles.cameraOptionBlock}>
            <Icon
              style={{ paddingTop: 50, paddingRight: 50 }}
              name={this.state.isFlashOn ? 'flash-on' : 'flash-off'}
              size={22}
              color="white"
              onPress={() => this.setState({ isFlashOn: !this.state.isFlashOn })}
            />
            {this.state.code && this.state.code.type && <Text style={styles.codeDetect}>{this.state.code.type} code detected</Text>}
            <Icon
              style={{ paddingTop: 50, paddingLeft: 50 }}
              name={this.state.isCameraFront ? 'camera-front' : 'camera-rear'}
              size={22}
              color="white"
              onPress={() => this.setState({ isCameraFront: !this.state.isCameraFront })}
            />
          </View>
        </Camera>}

        <View style={styles.snapBlock}>
          <Icon style={{ paddingVertical: 50, paddingRight: 50 }} name="collections" size={22} color="#9E9E9E" onPress={() => this.pickImage()} />
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
          <Icon style={{ paddingVertical: 50, paddingLeft: 50 }} name="inbox" size={22} color="#9E9E9E" onPress={Actions.tabbar} />
        </View>
        <View style={styles.footerBlock}>
          <Button
            style={[styles.footerButton, this.state.selectedFeature === 'book' ? styles.selectedFooterButton : null]}
            onPress={() => { this.setState({ selectedFeature: 'book' }); onDecreaseClick(); }}
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
            onPress={() => { this.setState({ selectedFeature: 'codescan' }); onIncreaseClick(); }}
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
  value: React.PropTypes.number,
  onIncreaseClick: React.PropTypes.func,
  onDecreaseClick: React.PropTypes.func,
};

CameraView.defaultProps = {
  title: '',
};

const mapStateToProps = (state) => {
  return {
    value: state.counter.count,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIncreaseClick: () => {
      dispatch(increaseAction());
    },
    onDecreaseClick: () => {
      dispatch(decreaseAction());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraView);
