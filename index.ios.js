import {
  AppRegistry,
} from 'react-native';

import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies

import Anysnap from './Anysnap';

Reactotron.connect({ enabled: __DEV__ });  // eslint-disable-line no-undef

AppRegistry.registerComponent('Anysnap', () => Anysnap);
