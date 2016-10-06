import offline from 'react-native-simple-store';

export const UNIQUE_ID_LOADED = 'UNIQUE_ID_LOADED';

function uniqueIDLoaded(uniqueID) {
  return {
    uniqueID,
    type: UNIQUE_ID_LOADED,
  };
}

export function loadUniqueID() {
  return (dispatch) => {
    offline.get('UniqueID').then((uniqueID) => {
      dispatch(uniqueIDLoaded(uniqueID || ''));
    });
  };
}
