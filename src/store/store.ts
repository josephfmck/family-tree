import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { relationshipsApi } from './api/relationshipsApi';
import { relationshipTypesApi } from './api/relationshipTypesApi';
import { personsApi } from './api/personsApi';
import { relationshipNamesApi } from './api/relationshipNamesApi';
import relationshipsReducer from './slices/relationshipsSlice';
import personsReducer from './slices/personsSlice';
import relationshipTypesReducer from './slices/relationshipTypesSlice';
import relationshipNamesReducer from './slices/relationshipNamesSlice';

export const store = configureStore({
  reducer: {
    [relationshipsApi.reducerPath]: relationshipsApi.reducer,
    [relationshipTypesApi.reducerPath]: relationshipTypesApi.reducer,
    [personsApi.reducerPath]: personsApi.reducer,
    // pulls in the names of the relationships
    [relationshipNamesApi.reducerPath]: relationshipNamesApi.reducer,
    relationships: relationshipsReducer,
    persons: personsReducer,
    relationshipTypes: relationshipTypesReducer,
    // keeps track of the names of the relationships
    relationshipNames: relationshipNamesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(relationshipsApi.middleware)
    .concat(relationshipTypesApi.middleware)
    .concat(personsApi.middleware)
    .concat(relationshipNamesApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;