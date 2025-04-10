import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import { clientReducer } from '../store/slices/clientSlice.ts'
import { productReducer } from '../store/slices/productSlice.ts'
import { arrivalReducer } from '../store/slices/arrivalSlice.ts'
import { orderReducer } from '../store/slices/orderSlice.ts'
import { userReducer } from '../store/slices/userSlice.ts'
import { taskReducer } from '../store/slices/taskSlice.ts'
import { serviceReducer } from '../store/slices/serviceSlice.ts'
import { stockReducer } from '../store/slices/stocksSlice.ts'
import { counterpartyReducer } from '../store/slices/counterpartySlices.ts'
import { reportReducer } from '../store/slices/reportSlice.ts'
import { serviceCategoryReducer } from '../store/slices/serviceCategorySlice.ts'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants'
import { authReducer } from '../store/slices/authSlice.ts'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
}

const rootReducer = combineReducers({
  clients: clientReducer,
  products: productReducer,
  arrivals: arrivalReducer,
  orders: orderReducer,
  auth: authReducer,
  users: userReducer,
  tasks: taskReducer,
  services: serviceReducer,
  stocks: stockReducer,
  counterparties: counterpartyReducer,
  reports: reportReducer,
  serviceCategories: serviceCategoryReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
