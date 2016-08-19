// 3rd party libraries
import RNFetchBlob from 'react-native-fetch-blob';

import { config } from '../config';

export function craftarSearch(path) {
  return RNFetchBlob.fetch(
    'POST',
    'https://search.craftar.net/v1/search',
    {
      'Content-Type': 'multipart/form-data',
    },
    [
      { name: 'image', filename: 'image.jpg', type: 'image/jpg', data: RNFetchBlob.wrap(path) },
      { name: 'token', data: config.craftarToken },
    ]
  );
}
