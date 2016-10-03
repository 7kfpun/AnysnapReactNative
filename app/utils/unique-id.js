import {
  Platform,
} from 'react-native';

// 3rd party libraries
import DeviceInfo from 'react-native-device-info';
import OneSignal from 'react-native-onesignal';
import store from 'react-native-simple-store';

import uuid from './uuid';

let uniqueID;

function UniqueID() {
  store.get('UniqueID')
    .then((savedUniqueID) => {
      if (!savedUniqueID) {
        if (Platform.OS === 'ios') {
          uniqueID = DeviceInfo.getUniqueID();
        } else if (Platform.OS === 'android') {
          uniqueID = uuid.uuid();
        }
        console.log('UniqueID', uniqueID);
        store.save('UniqueID', uniqueID);
      } else {
        uniqueID = savedUniqueID;
        console.log('UniqueID', uniqueID);
      }
      OneSignal.sendTag('UniqueID', uniqueID);
    });
  return uniqueID;
}

export default UniqueID;
