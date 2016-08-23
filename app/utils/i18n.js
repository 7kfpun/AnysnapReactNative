import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    main: 'Main',
    history: 'History',
    settings: 'Settings',
    camera: 'Camera',
    'photo-library': 'Photo library',
    version: 'Version',
  },
  zh: {
    main: '主頁',
    history: '歷史',
    settings: '設定',
    camera: '相機',
    'photo-library': '相冊',
    version: '版本',
  },
};

export default I18n;
