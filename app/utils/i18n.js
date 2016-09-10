import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    main: 'Main',
    result: 'Result',
    'more-information': 'More information',
    history: 'History',
    notification: 'Notification',
    settings: 'Settings',
    camera: 'Camera',
    'photo-library': 'Photo library',
    version: 'Version',
    admin: 'Admin',
    'admin-pick-image': 'Pick image',
    'admin-remove-all': 'Remove all',
    'admin-confirm': 'Confirm',
    'account-login': 'Login',
    username: 'USERNAME',
    password: 'PASSWORD',
  },
  zh: {
    main: '主頁',
    result: 'Result',
    'more-information': '詳細資料',
    history: '歷史',
    notification: '通知',
    settings: '設定',
    camera: '相機',
    'photo-library': '相冊',
    version: '版本',
    admin: 'Admin',
    'admin-pick-image': 'Pick image',
    'admin-remove-all': 'Remove all',
    'admin-confirm': 'Confirm',
    'account-login': 'Login',
    username: '用戶名稱',
    password: '登錄密碼',
  },
};

export default I18n;
