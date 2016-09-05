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
import HistoryDetailView from './app/components/history-detail';
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
    <Scene key="camera" title="Camera" component={CameraView} hideNavBar={true} direction="vertical" />

    <Scene key="login" title="Login" component={LoginView} />

    <Scene key="tabbar" tabs={true} initial={true} tabBarStyle={{ backgroundColor: '#2BBDC3' }}>

      <Scene key="main" title={I18n.t('result')} icon={TabIcon} iconName="timeline">
        <Scene key="main" title={I18n.t('main')} component={HomeView} />
        <Scene key="result" title={I18n.t('result')} component={ResultView} hideNavBar={true} initial={true} />
      </Scene>

      <Scene key="notification" title={I18n.t('main')} icon={TabIcon} iconName="dashboard" hideNavBar={true} component={NotificationView} />
      <Scene key="history" title={I18n.t('history')} icon={TabIcon} iconName="add-a-photo" hideNavBar={true} component={HistoryView} />
      <Scene key="settings" title={I18n.t('settings')} icon={TabIcon} iconName="announcement" component={SettingsView} />
      <Scene key="admin" title={I18n.t('admin')} icon={TabIcon} iconName="account-circle" component={AdminView} />
    </Scene>

    <Scene key="historyDetail" title={I18n.t('history')} hideNavBar={true} component={HistoryDetailView} />

  </Scene>
);

export default class App extends Component {
  render() {
    return <Router scenes={scenes} />;
  }
}
