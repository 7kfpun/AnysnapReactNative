import {
  Platform,
} from 'react-native';

// 3rd party libraries
import DeviceInfo from 'react-native-device-info';
import store from 'react-native-simple-store';

import uuid from './uuid';

function UniqueID() {
  let uniqueID;
  store.get('UniqueID')
    .then((savedUniqueID) => {
      if (!savedUniqueID) {
        if (Platform.OS === 'ios') {
          uniqueID = DeviceInfo.getUniqueID();
          store.save('UniqueID', uniqueID);
        } else if (Platform.OS === 'android') {
          uniqueID = uuid.uuid();
          store.save('UniqueID', uniqueID);
        }
      }
    });

  return uniqueID;
}

export default UniqueID;
