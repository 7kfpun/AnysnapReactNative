import React, { Component } from 'react';

// 3rd party libraries
import {
  Actions,
  Router,
  Scene,
} from 'react-native-router-flux';

import firebase from 'firebase';

// Views
import LoginView from './app/components/login';
import HomeView from './app/components/home';
import NotificationView from './app/components/notification';
import CameraView from './app/components/camera';
import ResultView from './app/components/result';
import HistoryView from './app/components/history';
import SettingsView from './app/components/settings';
import AdminView from './app/components/admin';

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
    <Scene key="camera" title={I18n.t('camera')} component={CameraView} hideNavBar={true} direction="vertical" initial={true} />

    <Scene key="login" title="Login" component={LoginView} />

    <Scene key="tabbar" tabs={true} tabBarStyle={{ backgroundColor: '#2BBDC3' }}>
      <Scene key="main" title={I18n.t('more-information')} icon={TabIcon} iconName="timeline" hideNavBar={true}>
        <Scene key="history" title={I18n.t('history')} component={HistoryView} initial={true} />
        <Scene key="result" title={I18n.t('more-information')} component={ResultView} />
      </Scene>

      <Scene key="mainFirst" title={I18n.t('more-information')} icon={TabIcon} iconName="dashboard" hideNavBar={true} component={HomeView} />
      <Scene key="notification" title={I18n.t('main')} icon={TabIcon} iconName="add-a-photo" hideNavBar={true} component={NotificationView} />
      <Scene key="settings" title={I18n.t('settings')} icon={TabIcon} iconName="announcement" component={SettingsView} />
      <Scene key="admin" title={I18n.t('admin')} icon={TabIcon} iconName="account-circle" component={AdminView} />
    </Scene>
  </Scene>
);


const App = function App() {
  return <Router scenes={scenes} />;
};

export default App;
