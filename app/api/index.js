import firebase from 'firebase';

// 3rd party libraries
import { RNS3 } from 'react-native-aws3';
import DeviceInfo from 'react-native-device-info';
import RNFetchBlob from 'react-native-fetch-blob';  // eslint-disable-line import/no-named-as-default,import/no-named-as-default-member

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
  .uploadProgress((written, total) => console.log('uploaded', written / total))
  .progress((received, total) => console.log('progress', received / total))
  .then(response => response.json())
  .then((json) => {
    console.log('Craftar search', json);

    try {
      firebase.database().ref(`app/image/${filename}/id`).set(filename);
      firebase.database().ref(`app/image/${filename}/timestamp`).set(new Date().getTime());
      firebase.database().ref(`app/image/${filename}/uniqueID`).set(uniqueID);
      firebase.database().ref(`app/image/${filename}/original`).set(path);
      firebase.database().ref(`app/craftar/${filename}`).set(json);
    } catch (err) {
      console.warn(err);
    }

    return json;
  })
  .catch(error => console.error('Error', error));
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
  .then(response => response.json())
  .catch(error => console.error('Error', error));
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
  .catch(error => console.error('Error', error));
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
  .then(response => response.json())
  .then((json) => {
    console.log('Uploaded image', json);

    try {
      firebase.database().ref(`app/image/${filename}/id`).set(filename);
      firebase.database().ref(`app/image/${filename}/timestamp`).set(new Date().getTime());
      firebase.database().ref(`app/image/${filename}/uniqueID`).set(uniqueID);
      firebase.database().ref(`app/image/${filename}/bucket`).set(json);
    } catch (err) {
      console.warn(err);
    }

    return json;
  })
  .catch(error => console.warn(error));
}

export function uploadImageS3(filename, image) {
  console.log(filename);
  const file = {
    uri: image,
    name: `${filename}.jpg`,
    type: 'image/jpeg',
  };

  const options = Object.assign(config.s3, { keyPrefix: `test/${uniqueID}/` });

  return RNS3.put(file, options).then((json) => {
    if (json.status !== 201) {
      throw new Error('Failed to upload image to S3.');
    }

    console.log('Uploaded image S3', json);

    try {
      firebase.database().ref(`app/image/${filename}/id`).set(filename);
      firebase.database().ref(`app/image/${filename}/timestamp`).set(new Date().getTime());
      firebase.database().ref(`app/image/${filename}/uniqueID`).set(uniqueID);
      firebase.database().ref(`app/image/${filename}/s3`).set(json);
    } catch (err) {
      console.warn(err);
    }

    return json;
  })
  .catch(error => console.warn(error));
}

export function googleVision(filename) {
  console.log('googleVision', filename);
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
    .then(response => response.json())
    .then((json) => {
      console.log('Google vision image', json);

      try {
        firebase.database().ref(`app/vision/${filename}`).set(json);
      } catch (err) {
        console.warn(err);
      }

      return json;
    })
    .catch(error => console.warn(error));
}

export function getUserImages(UniqueID) {
  console.log('getUserImages', UniqueID);
  return fetch(  // eslint-disable-line no-undef
    `https://frontn-anysnap.herokuapp.com/core/users/${UniqueID}/images/`,
    {
      method: 'GET',
    })
    .then(response => response.json())
    .then((json) => {
      console.log('Get user images', json);
      return json;
    })
    .catch(error => console.warn(error));
}

export function createUserImage(url, originalUri, userId) {
  console.log('createUserImage', url, originalUri, userId);
  return fetch(  // eslint-disable-line no-undef
    `https://frontn-anysnap.herokuapp.com/core/users/${userId}/images/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        original_uri: originalUri,
      }),
    })
    .then(response => response.json())
    .then((json) => {
      console.log('Create user image', json);
      return json;
    })
    .catch(error => console.warn(error));
}

export function deleteUserImage(id, userId) {
  console.log('deleteUserImage', id, userId);
  return fetch(  // eslint-disable-line no-undef
    `https://frontn-anysnap.herokuapp.com/core/users/${userId}/images/${id}/`,
    {
      method: 'DELETE',
    })
    .then((json) => {
      console.log('Delete user image', json);
      return json;
    })
    .then(response => response.json())
    .catch(error => console.warn(error));
}

export function createUserImageResult(userId, imageId, code) {
  console.log('createUserImageResult', userId, imageId, code);
  return fetch(  // eslint-disable-line no-undef
    `https://frontn-anysnap.herokuapp.com/core/users/${userId}/images/${imageId}/results/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: code,
      }),
    })
    .then(response => response.json())
    .then((json) => {
      console.log('Create user image result', json);
      return json;
    })
    .catch(error => console.warn(error));
}

export function bingImageSearch(query) {
  console.log('bingImageSearch', query);
  return fetch(  // eslint-disable-line no-undef
    `https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=${query}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Ocp-Apim-Subscription-Key': config.microsoft.bingSearch,
      },
    })
    .then(response => response.json())
    .then((json) => {
      console.log('bingImageSearch', json);
      return json;
    })
    .catch(error => console.warn(error));
}

export function googleSearch(query) {
  console.log('googleSearch', query);
  const resultsForPage = 5;
  return fetch(  // eslint-disable-line no-undef
    `https://www.googleapis.com/customsearch/v1?q=${query}&lr=lang_en&safe=high&cx=${config.googleSearch.cx}&key=${config.googleSearch.key}&lr=lang_zh-TW&num=${resultsForPage}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then((json) => {
      console.log('googleSearch', json);
      return json;
    })
    .catch(error => console.warn(error));
}
