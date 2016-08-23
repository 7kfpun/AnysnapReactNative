import React, { Component } from 'react';

// 3rd party libraries
import {
  Actions,
  Router,
  Scene,
} from 'react-native-router-flux';

import firebase from 'firebase';

// Views
import HomeView from './app/components/home';
import CameraView from './app/components/camera';
import ResultView from './app/components/result';
import HistoryView from './app/components/history';
import SettingsView from './app/components/settings';

// Elements
import TabIcon from './app/elements/tab-icon';

// GoogleAnalytics.setTrackerId(config.googleAnalytics[Platform.OS]);
//
// if (DeviceInfo.getDeviceName() === 'iPhone Simulator') {
//   GoogleAnalytics.setDryRun(true);
// }

import { config } from './app/config';
import I18n from './app/utils/i18n';

firebase.initializeApp(config.firebase);

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="camera" title="Camera" component={CameraView} direction="vertical" />
    <Scene key="result" title="Result" component={ResultView} />

    <Scene key="tabbar" initial={true} tabs={true}>
      <Scene key="main" title={I18n.t('main')} icon={TabIcon} iconName="ios-home" component={HomeView} />
      <Scene key="history" title={I18n.t('history')} icon={TabIcon} iconName="ios-camera" component={HistoryView} />
      <Scene key="settings" title={I18n.t('settings')} icon={TabIcon} iconName="ios-settings" component={SettingsView} />
    </Scene>
  </Scene>
);

export default class App extends Component {
  render() {
    return <Router scenes={scenes} />;
  }
}
