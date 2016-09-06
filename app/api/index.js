import firebase from 'firebase';

// 3rd party libraries
import DeviceInfo from 'react-native-device-info';
import Reactotron from 'reactotron';  // eslint-disable-line import/no-extraneous-dependencies
import RNFetchBlob from 'react-native-fetch-blob';

import { config } from '../config';

const uniqueID = DeviceInfo.getUniqueID();

// curl https://search.craftar.net/v1/search -F "token=afe34dbe14890fac" -F "image=@query.jpg"
export function craftarSearch(filename, path) {
  return RNFetchBlob.fetch(
    'POST',
    'https://search.craftar.net/v1/search',
    {
      'Content-Type': 'multipart/form-data',
    },
    [
      { name: 'token', data: config.craftarToken },
      { name: 'image', filename: 'image.jpg', data: RNFetchBlob.wrap(path) },
    ]
  )
  .uploadProgress((written, total) => {
    console.log('uploaded', written / total);
  })
  // listen to download progress event
  .progress((received, total) => {
    console.log('progress', received / total);
  })
  .then((response) => response.json())
  .then((json) => {
    Reactotron.log({ log: 'Craftar search', json });

    firebase.database().ref(`app/img/${filename}/timestamp`).set(new Date().getTime());
    firebase.database().ref(`app/img/${filename}/uniqueID`).set(uniqueID);
    firebase.database().ref(`app/img/${filename}/original`).set(path);
    firebase.database().ref(`app/craftar/${filename}`).set(json);

    return json;
  })
  .catch((error) => console.error('Error', error));
}

// curl -X POST \
//     -H "Content-Type: application/json" \
//     'https://my.craftar.net/api/v0/item/?api_key=123456789abcdefghijk123456789abcdefghijk' \
//     -d '{"collection": "/api/v0/collection/806e54535ffd464f83545c902e664aca/",
//         "name": "The birth of venus",
//         "url": "http://en.wikipedia.org/wiki/The_Birth_of_Venus_(Botticelli)" }'
export function craftarCreateItem(name, url) {
  return fetch(  // eslint-disable-line no-undef
    `https://my.craftar.net/api/v0/item/?api_key=${config.craftarApiKey}`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        url,
        collection: config.craftarCollection,
      }),
    }
  )
  .then((response) => response.json())
  .catch((error) => console.error('Error', error));
}

// curl -X POST
//     'https://my.craftar.net/api/v0/image/?api_key=123456789abcdefghijk123456789abcdefghijk'
//     -F "item=/api/v0/item/4fe672886ec142f6ab6d72d54acf046f/"
//     -F "file=@back_cover.jpg"
// curl -X POST 'https://my.craftar.net/api/v0/image/?api_key=104ed974abf170f12b7887d54344c0b630972e05' -F "item=/api/v0/item/3b39a4a777dd4794a956ff0ff3ad9e29/" -F "file=@back_cover.jpg"
export function craftarCreateImage(item, file) {
  console.log(file);
  return RNFetchBlob.fetch(
    'POST',
    `https://my.craftar.net/api/v0/image/?api_key=${config.craftarApiKey}`,
    {
      'Content-Type': 'multipart/form-data',
    },
    [
      { name: 'item', data: item },
      { name: 'file', filename: 'image.jpg', data: RNFetchBlob.wrap(file) },
    ]
  )
  .uploadProgress((written, total) => {
    console.log('uploaded', written / total);
  })
  // listen to download progress event
  .progress((received, total) => {
    console.log('progress', received / total);
  })
  .catch((error) => console.error('Error', error));
}

export function uploadImage(filename, image) {
  console.log(filename);
  return RNFetchBlob.fetch(
    'POST',
    `https://www.googleapis.com/upload/storage/v1/b/${config.firebase.storageBucket}/o?uploadType=media&name=${filename}`,
    {
      'Content-Type': 'image/jpeg',
    },
    RNFetchBlob.wrap(image)
  )
  .then((response) => response.json())
  .then((json) => {
    Reactotron.log({ log: 'Uploaded image', json });

    try {
      firebase.database().ref(`app/bucket/${filename}`).set(json);
    } catch (err) {
      console.warn(err);
    }

    return json;
  })
  .catch((error) => {
    console.warn(error);
  });
}


export function googleVision(filename) {
  console.log(filename);
  return fetch(  // eslint-disable-line no-undef
    `https://vision.googleapis.com/v1/images:annotate?key=${config.gcloudVision}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: {
              source: {
                gcs_image_uri: `gs://${config.firebase.storageBucket}/${filename}`,
              },
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 10,
              },
              {
                type: 'LOGO_DETECTION',
                maxResults: 5,
              },
              {
                type: 'TEXT_DETECTION',
                maxResults: 15,
              },
            ],
          },
        ],
      }),
    })
    .then((response) => response.json())
    .then((json) => {
      Reactotron.log({ log: 'Google vision image', json });

      try {
        firebase.database().ref(`app/vision/${filename}`).set(json);
      } catch (err) {
        console.warn(err);
      }

      return json;
    })
    .catch((error) => {
      console.warn(error);
    });
}
