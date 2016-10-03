import React from 'react';

// 3rd party libraries
import { Router } from 'react-native-router-flux';

import firebase from 'firebase';

import { config } from './config';
import scenes from './scenes';
import UniqueID from './utils/unique-id';

firebase.initializeApp(config.firebase);
const uniqueID = UniqueID();  // eslint-disable-line no-unused-vars,new-cap

// GoogleAnalytics.setTrackerId(config.googleAnalytics[Platform.OS]);
//
// if (DeviceInfo.getDeviceName() === 'iPhone Simulator' || DeviceInfo.getDeviceName() === 'apple’s MacBook Pro' || DeviceInfo.getManufacturer() === 'Genymotion') {
//   console.log('GoogleAnalytics setDryRun');
//   GoogleAnalytics.setDryRun(true);
// }

console.ignoredYellowBox = [
  'Warning: Failed prop type: Invalid prop `title` of type `object` supplied to `exports`, expected `string`.',
];

const App = function App() {
  return <Router scenes={scenes} />;
};

export default App;
