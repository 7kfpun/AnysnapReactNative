import {
  Platform,
} from 'react-native';

// 3rd party libraries
import DeviceInfo from 'react-native-device-info';
import OneSignal from 'react-native-onesignal';
import store from 'react-native-simple-store';

import uuid from './uuid';

function UniqueID() {
  let UNIQUEID;
  store.get('UNIQUEID')
    .then((savedUniqueID) => {
      if (!savedUniqueID) {
        if (Platform.OS === 'ios') {
          UNIQUEID = DeviceInfo.getUniqueID();
        } else if (Platform.OS === 'android') {
          UNIQUEID = uuid.uuid();
        }
        store.save('UNIQUEID', UNIQUEID);
      } else {
        UNIQUEID = savedUniqueID;
      }
      console.log('UNIQUEID', UNIQUEID);
      OneSignal.sendTag('UNIQUEID', UNIQUEID);
    });
}

export default UniqueID;
