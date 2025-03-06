import { configureStore } from '@reduxjs/toolkit'
import { clientReducer } from '../store/slices/clientSlice.ts'
import { productReducer } from '../store/slices/productSlice.ts'
import { arrivalReducer } from '../store/slices/arrivalSlice.ts'
import { orderReducer } from '../store/slices/orderSlice.ts'
import { userReducer } from '../store/slices/userSlice.ts'

export const store = configureStore({
  reducer: {
    clients: clientReducer,
    products: productReducer,
    arrivals: arrivalReducer,
    orders: orderReducer,
    users: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
