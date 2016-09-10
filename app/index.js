import React from 'react';

// 3rd party libraries

import { Router } from 'react-native-router-flux';

import firebase from 'firebase';

import scenes from './scenes';

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

const App = function App() {
  return <Router scenes={scenes} />;
};

export default App;
