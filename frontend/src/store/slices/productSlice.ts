import { GlobalError, Product } from '../../types'
import { createSlice } from '@reduxjs/toolkit'
import { addProduct, deleteProduct, fetchProductById, fetchProducts, updateProduct } from '../thunks/productThunk.ts'
import { RootState } from '../../app/store.ts'

interface ProductState {
  product: Product | null;
  products: Product[] | null;
  loadingFetch : boolean;
  loadingAdd: boolean;
  loadingDelete: boolean;
  loadingUpdate: boolean;
  error: GlobalError | null;
}

const initialState: ProductState = {
  product: null,
  products: null,
  loadingFetch: false,
  loadingAdd: false,
  loadingDelete: false,
  loadingUpdate: false,
  error: null,
}

export const selectProduct = (state: RootState) => state.products.product
export const selectAllProducts = (state: RootState) => state.products.products
export const selectLoadingFetchProduct = (state: RootState) => state.products.loadingFetch
export const selectLoadingAddProduct = (state: RootState) => state.products.loadingAdd
export const selectLoadingDeleteProduct = (state: RootState) => state.products.loadingDelete
export const selectLoadingUpdateProduct = (state: RootState) => state.products.loadingUpdate
export const selectProductError = (state: RootState) => state.products.error

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchProducts.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.products = action.payload
    })
    builder.addCase(fetchProducts.rejected, state => {
      state.loadingFetch = false
    })
    builder.addCase(fetchProductById.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.product = action.payload
    })
    builder.addCase(fetchProductById.rejected, state => {
      state.loadingFetch = false
    })
    builder.addCase(addProduct.pending, state => {
      state.loadingAdd = true
    })
    builder.addCase(addProduct.fulfilled, state => {
      state.loadingAdd = false
    })
    builder.addCase(addProduct.rejected, (state, { payload: error }) => {
      state.loadingAdd = false
      state.error = error || null
    })
    builder.addCase(deleteProduct.pending, state => {
      state.loadingDelete = true
      state.error = null
    })
    builder.addCase(deleteProduct.fulfilled, state => {
      state.loadingDelete = false
      state.error = null
    })
    builder.addCase(deleteProduct.rejected, (state, { payload: error }) => {
      state.loadingDelete = false
      state.error = error || null
    })
    builder.addCase(updateProduct.pending, state => {
      state.loadingUpdate = true
      state.error = null
    })
    builder.addCase(updateProduct.fulfilled, state => {
      state.loadingUpdate = false
      state.error = null
    })
    builder.addCase(updateProduct.rejected, (state, { payload: error }) => {
      state.loadingUpdate = false
      state.error = error || null
    })
  },
})

export const productReducer = productSlice.reducer
