import {
  AppRegistry,
} from 'react-native';

import Reactotron from 'reactotron';

import Anysnap from './Anysnap';

Reactotron.connect({ enabled: __DEV__ });

AppRegistry.registerComponent('Anysnap', () => Anysnap);
