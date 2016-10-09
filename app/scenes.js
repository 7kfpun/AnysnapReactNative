import React from 'react';
import { StyleSheet } from 'react-native';

// 3rd party libraries
import { Actions, Scene } from 'react-native-router-flux';

// Views
// import HomeView from './components/home';
import FeedView from './components/feed';
import NotificationView from './components/notification';
import CameraView from './components/camera';
import CameraTabView from './components/camera-tab';
import ResultView from './components/result';
import ResultFeedbackView from './components/result-feedback';
import HistoryListView from './components/history-list';
// import SettingsView from './components/settings';
// import AdminView from './components/admin';
import IntroView from './components/intro';
import FeedbackView from './components/feedback';
// import LoginView from './components/login';

// Elements
import TabIcon from './elements/tab-icon';

import I18n from './utils/i18n';

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="camera" title={'AnySnap'} component={CameraView} hideNavBar direction="leftToRight" initial />
    <Scene key="intro" title={I18n.t('intro')} component={IntroView} hideNavBar hideTabBar direction="vertical" panHandlers={null} />

    <Scene key="tabbar" tabs tabBarStyle={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#DBDBDB' }}>
      <Scene key="main" icon={TabIcon} iconName="inbox">
        <Scene key="history" title={I18n.t('history')} component={HistoryListView} hideNavBar panHandlers={null} />
        <Scene key="result" title={I18n.t('anysnap-results')} component={ResultView} hideNavBar panHandlers={null} />
        <Scene key="resultFeedback" title={I18n.t('result-feedback')} component={ResultFeedbackView} hideNavBar panHandlers={null} />
      </Scene>

      <Scene key="feed" title={I18n.t('discovery')} icon={TabIcon} iconName="dashboard" component={FeedView} hideNavBar panHandlers={null} />
      <Scene key="cameraTab" title={I18n.t('main')} icon={TabIcon} iconName="add-a-photo" component={CameraTabView} hideNavBar />
      <Scene key="notification" title={I18n.t('notification')} icon={TabIcon} iconName="notifications" component={NotificationView} hideNavBar panHandlers={null} />

      <Scene key="settingsFeedback" title={I18n.t('feedback')} icon={TabIcon} iconName="announcement" component={FeedbackView} hideNavBar panHandlers={null} />

      {/* <Scene key="settings" icon={TabIcon} iconName="account-circle">
        <Scene key="settingsMain" title={I18n.t('settings')} component={SettingsView} hideNavBar />
        <Scene key="settingsIntro" title={I18n.t('intro')} component={IntroView} hideNavBar hideTabBar direction="vertical" />
        <Scene key="settingsLogin" title={I18n.t('login')} component={LoginView} hideNavBar hideTabBar direction="vertical" />
        <Scene key="settingsFeedback" title={I18n.t('feedback')} component={FeedbackView} hideNavBar hideTabBar direction="vertical" />
        <Scene key="settingsSendMail" title={I18n.t('settings')} component={SettingsView} hideNavBar />
      </Scene> */}
    </Scene>
  </Scene>
);

export default scenes;
