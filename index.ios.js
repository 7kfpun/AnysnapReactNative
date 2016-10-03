import {
  AppRegistry,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import OneSignal from 'react-native-onesignal';

import Anysnap from './app';

const pendingNotifications = [];

function handleNotification(notification) {
  Actions.notification(notification);
  // title: notification.data.title,
  // link: notification.data.url,
  // action: notification.data.actionSelected
}

OneSignal.configure({
  onIdsAvailable(device) {
    console.log('UserId = ', device.userId);
    console.log('PushToken = ', device.pushToken);
  },

  onNotificationOpened(message, data, isActive) {
    const notification = { message, data, isActive };
    console.log('NOTIFICATION OPENED: ', notification);
    if (!Actions.notification) { // Check if there is a navigator object. If not, waiting with the notification.
      console.log('Navigator is null, adding notification to pending list...');
      pendingNotifications.push(notification);
      return;
    }
    handleNotification(notification);
  },
});

AppRegistry.registerComponent('Anysnap', () => Anysnap);
