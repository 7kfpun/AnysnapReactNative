import { applyMiddleware, createStore } from 'redux';
import { AsyncStorage } from 'react-native';
import { persistStore } from 'redux-persist';
import promiseMiddleware from 'redux-promise';
import thunk from 'redux-thunk';
import reducers from '../reducers';

const middleware = applyMiddleware([thunk, promiseMiddleware]);

function configureStore(onComplete) {
  const store = createStore(reducers, {}, middleware);
  persistStore(store, { storage: AsyncStorage }, onComplete);
  return store;
}

module.exports = configureStore;
