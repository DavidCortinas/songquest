import { applyMiddleware, combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { song, user } from './reducers';
import { authSlice } from './reducers';


const songReducer = {
  song,
};

const userReducer = {
  user,
};

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers({
  ...songReducer,
  ...userReducer,
  auth: authSlice.reducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const configuredStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: composeWithDevTools(applyMiddleware(thunk)),
  });
