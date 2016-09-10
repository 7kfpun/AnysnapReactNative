import React from 'react';

// 3rd party libraries
import { Actions, Scene } from 'react-native-router-flux';

// Views
import LoginView from './components/login';
import HomeView from './components/home';
// import NotificationView from './components/notification';
import CameraView from './components/camera';
import CameraTabView from './components/camera-tab';
import ResultView from './components/result';
import HistoryView from './components/history';
import SettingsView from './components/settings';
import AdminView from './components/admin';

// Elements
import TabIcon from './elements/tab-icon';

import I18n from './utils/i18n';

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="camera" title={I18n.t('camera')} component={CameraView} hideNavBar={true} direction="vertical" initial={true} />

    <Scene key="login" title="Login" component={LoginView} />

    <Scene key="tabbar" tabs={true} tabBarStyle={{ backgroundColor: '#2BBDC3' }}>
      <Scene key="main" title={I18n.t('more-information')} icon={TabIcon} iconName="timeline" hideNavBar={true}>
        <Scene key="history" title={I18n.t('history')} component={HistoryView} />
        <Scene key="result" title={I18n.t('more-information')} component={ResultView} />
      </Scene>

      <Scene key="mainFirst" title={I18n.t('more-information')} icon={TabIcon} iconName="dashboard" hideNavBar={true} component={HomeView} />
      <Scene key="cameraTab" title={I18n.t('main')} icon={TabIcon} iconName="add-a-photo" hideNavBar={true} component={CameraTabView} />
      <Scene key="settings" title={I18n.t('settings')} icon={TabIcon} iconName="announcement" component={SettingsView} />
      <Scene key="admin" title={I18n.t('admin')} icon={TabIcon} iconName="account-circle" component={AdminView} />
    </Scene>
  </Scene>
);

export default scenes;
