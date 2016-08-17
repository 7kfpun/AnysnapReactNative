import React, { Component } from 'react';

// 3rd party libraries
import {
  Actions,
  Router,
  Scene,
} from 'react-native-router-flux';

// Views
import MainView from './app/components/main';

// Elements
import TabIcon from './app/elements/tab-icon';

// GoogleAnalytics.setTrackerId(config.googleAnalytics[Platform.OS]);
//
// if (DeviceInfo.getDeviceName() === 'iPhone Simulator') {
//   GoogleAnalytics.setDryRun(true);
// }

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="tabbar" initial={true} tabs={true}>
      <Scene key="main" title="Main" icon={TabIcon} iconName="ios-home" component={MainView} />
      <Scene key="Camera" title="Camera" icon={TabIcon} iconName="ios-camera" component={MainView} />
      <Scene key="Settings" title="Settings" icon={TabIcon} iconName="ios-settings" component={MainView} />
    </Scene>
  </Scene>
);

export default class App extends Component {
  render() {
    return <Router scenes={scenes} />;
  }
}
