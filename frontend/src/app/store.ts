import { configureStore } from '@reduxjs/toolkit'
import { clientReducer } from '../store/slices/clientSlice.ts'
import { productReducer } from '../store/slices/productSlice.ts'

export const store = configureStore({
  reducer: {
    clients: clientReducer,
    products: productReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
