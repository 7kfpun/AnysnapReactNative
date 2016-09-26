import React from 'react';
import {
  Platform,
} from 'react-native';

// 3rd party libraries
import { Router } from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
import store from 'react-native-simple-store';

import firebase from 'firebase';

import scenes from './scenes';

import uuid from './utils/uuid';

// GoogleAnalytics.setTrackerId(config.googleAnalytics[Platform.OS]);
//
// if (DeviceInfo.getDeviceName() === 'iPhone Simulator') {
//   GoogleAnalytics.setDryRun(true);
// }

import { config } from './config';

firebase.initializeApp(config.firebase);

console.ignoredYellowBox = [
  'Warning: Failed prop type: Invalid prop `title` of type `object` supplied to `exports`, expected `string`.',
];

store.get('UniqueID')
  .then((UniqueID) => {
    if (!UniqueID) {
      if (Platform.OS === 'ios') {
        store.save('UniqueID', DeviceInfo.getUniqueID());
      } else if (Platform.OS === 'android') {
        store.save('UniqueID', uuid.uuid());
      }
    }
  });

const App = function App() {
  return <Router scenes={scenes} />;
};

export default App;
