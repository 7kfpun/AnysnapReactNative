import React from 'react';

// 3rd party libraries
import { Actions, Scene } from 'react-native-router-flux';

// Views
import LoginView from './components/login';
import HomeView from './components/home';
import NotificationView from './components/notification';
import CameraView from './components/camera';
import CameraTabView from './components/camera-tab';
import ResultView from './components/result';
import HistoryView from './components/history';
import SettingsView from './components/settings';
// import AdminView from './components/admin';
import IntroView from './components/intro';

// Elements
import TabIcon from './elements/tab-icon';

import I18n from './utils/i18n';

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="camera" title={I18n.t('camera')} component={CameraView} hideNavBar={true} direction="vertical" initial={true} />

    <Scene key="login" title="Login" component={LoginView} />

    <Scene key="tabbar" tabs={true} tabBarStyle={{ backgroundColor: '#2BBDC3' }}>
      <Scene key="main" icon={TabIcon} iconName="timeline">
        <Scene key="history" title={I18n.t('history')} component={HistoryView} hideNavBar={true} />
        <Scene key="result" title={I18n.t('more-information')} component={ResultView} hideNavBar={true} />
      </Scene>

      <Scene key="mainFirst" title={I18n.t('more-information')} icon={TabIcon} iconName="dashboard" component={HomeView} hideNavBar={true} />
      <Scene key="cameraTab" title={I18n.t('main')} icon={TabIcon} iconName="add-a-photo" component={CameraTabView} hideNavBar={true} />
      <Scene key="notification" title={I18n.t('notification')} icon={TabIcon} iconName="announcement" component={NotificationView} hideNavBar={true} />

      <Scene key="settings" icon={TabIcon} iconName="account-circle">
        <Scene key="settingsMain" title={I18n.t('settings')} component={SettingsView} hideNavBar={true} />
        <Scene key="settingsIntro" title={I18n.t('intro')} component={IntroView} hideNavBar={true} hideTabBar={true} direction="vertical" />
        <Scene key="settingsSendMail" title={I18n.t('settings')} component={SettingsView} hideNavBar={true} />
      </Scene>
    </Scene>
  </Scene>
);

export default scenes;
