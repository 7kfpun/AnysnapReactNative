import React, { Component } from 'react';
import {
  Dimensions,
  ImagePickerIOS,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';

import I18n from '../utils/i18n';

import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  cameraIcons: {
    width: Dimensions.get('window').width - 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  capture: {
    marginBottom: 20,
    paddingTop: 50,
  },
  library: {
    marginBottom: 24,
    paddingTop: 50,
    paddingRight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreButton: {
    marginBottom: 24,
    paddingTop: 50,
    paddingLeft: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
});

export default class CameraView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      permission: 'DENIED',
    };
  }

  takePicture() {
    this.camera.capture().then((data) => {
      Reactotron.log({ log: 'Camera captured', data });

      Actions.pop();
      Actions.result({ image: data.path });
    })
    .catch(err => Reactotron.log(err));
  }

  pickImage() {
    ImagePickerIOS.openSelectDialog({}, (response) => {
      Reactotron.log(response);
      if (response) {
        Actions.result({ image: response });
      }
    }, (err) => console.log(err));
  }

  render() {
    return (
      <View style={styles.container}>
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
        >
          <View style={styles.cameraIcons}>
            <TouchableHighlight onPress={() => this.pickImage()} underlayColor="transparent">
              <View style={styles.library}>
                <Icon name="photo-library" size={26} color="white" />
                <Text style={styles.text}>{I18n.t('photo-library')}</Text>
              </View>
            </TouchableHighlight>

            <Icon name="photo-camera" style={styles.capture} size={52} color="white" onPress={() => this.takePicture()} />

            <TouchableHighlight onPress={() => Actions.tabbar()} underlayColor="transparent">
              <View style={styles.moreButton}>
                <Icon name="format-list-bulleted" size={26} color="white" />
                <Text style={[styles.text, { fontSize: 12 }]}>{I18n.t('photo-library')}</Text>
              </View>
            </TouchableHighlight>
          </View>
        </Camera>}
      </View>
    );

    // return (
    //   <View style={styles.container}>
    //     <Camera
    //       ref={(cam) => {
    //         this.camera = cam;
    //       }}
    //       style={styles.preview}
    //       captureAudio={false}
    //       aspect={Camera.constants.Aspect.fill}
    //       captureTarget={Camera.constants.CaptureTarget.temp}
    //       onBarCodeRead={data => this.onBarCodeRead(data)}
    //     >
    //       <View>
    //         <Icon name="photo-camera" style={styles.capture} size={52} color="white" onPress={() => this.takePicture()} />
    //
    //         <Icon name="settings" style={styles.settings} size={24} color="white" onPress={() => this.takePicture()} />
    //       </View>
    //     </Camera>
    //   </View>
    // );
  }
}
