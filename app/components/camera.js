import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  capture: {
    backgroundColor: 'black',
    marginBottom: 20,
    paddingTop: 50,
  },
});

export default class CameraView extends Component {
  takePicture() {
    this.camera.capture().then((data) => {
      Reactotron.log({ log: 'Camera captured', data });

      Actions.pop();
      Actions.result({ image: data.path });
    })
    .catch(err => Reactotron.log(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          captureAudio={false}
          aspect={Camera.constants.Aspect.fill}
          captureTarget={Camera.constants.CaptureTarget.temp}
          onBarCodeRead={data => this.onBarCodeRead(data)}
        >
          <View style={styles.cameraIcons}>
            <Icon name="photo-camera" style={styles.capture} size={52} color="white" onPress={() => this.takePicture()} />
          </View>
        </Camera>
      </View>
    );
  }
}
