import { configureStore } from '@reduxjs/toolkit'
import { clientReducer } from '@/store/slices/clientSlice.ts'
import { productReducer } from '@/store/slices/productSlice.ts'
import { arrivalReducer } from '@/store/slices/arrivalSlice.ts'
import { orderReducer } from '@/store/slices/orderSlice.ts'
import { userReducer } from '@/store/slices/userSlice.ts'
import { taskReducer } from '@/store/slices/taskSlice.ts'
import { serviceReducer } from '@/store/slices/serviceSlice.ts'
import { stockReducer } from '@/store/slices/stocksSlice.ts'
import { counterpartyReducer } from '@/store/slices/counterpartySlices.ts'
import { reportReducer } from '@/store/slices/reportSlice.ts'
import { serviceCategoryReducer } from '@/store/slices/serviceCategorySlice.ts'
import { authReducer } from '@/store/slices/authSlice.ts'
import { filesReducer } from '@/store/slices/deleteFileSlice.ts'
import { invoicesReducer } from '@/store/slices/invoiceSlice.ts'

export const store = configureStore({
  reducer: {
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
    invoices: invoicesReducer,
    files: filesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
