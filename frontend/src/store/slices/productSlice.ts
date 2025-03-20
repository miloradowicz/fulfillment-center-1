import { GlobalError, Product, ProductWithPopulate, ValidationError } from '../../types'
import { createSlice } from '@reduxjs/toolkit'
import {
  addProduct,
  deleteProduct,
  fetchProductsByClientId,
  fetchProductById,
  fetchProducts,
  updateProduct, fetchProductsWithPopulate, fetchProductByIdWithPopulate,
} from '../thunks/productThunk.ts'
import { RootState } from '../../app/store.ts'

interface ProductState {
  product: Product | null;
  productWithPopulate: ProductWithPopulate | null
  productsWithPopulate: ProductWithPopulate[] | null;
  products: Product[] | null;
  loadingFetch : boolean;
  loadingFetchOneClient : boolean;
  loadingAdd: boolean;
  loadingDelete: boolean;
  loadingUpdate: boolean;
  error: GlobalError | null;
  createAndUpdateError: ValidationError | null
}

const initialState: ProductState = {
  product: null,
  productWithPopulate: null,
  productsWithPopulate:null,
  products: null,
  loadingFetch: false,
  loadingFetchOneClient:false,
  loadingAdd: false,
  loadingDelete: false,
  loadingUpdate: false,
  error: null,
  createAndUpdateError: null,
}

export const selectProduct = (state: RootState) => state.products.product
export const selectAllProducts = (state: RootState) => state.products.products
export const selectProductWithPopulate = (state: RootState) => state.products.productWithPopulate
export const selectProductsWithPopulate = (state: RootState) => state.products.productsWithPopulate
export const selectLoadingFetchProduct = (state: RootState) => state.products.loadingFetch
export const selectLoadingAddProduct = (state: RootState) => state.products.loadingAdd
export const selectLoadingDeleteProduct = (state: RootState) => state.products.loadingDelete
export const selectLoadingUpdateProduct = (state: RootState) => state.products.loadingUpdate
export const selectProductError = (state: RootState) => state.products.error
export const selectCreateProductError = (state: RootState) => state.products.createAndUpdateError

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
    builder.addCase(fetchProductsWithPopulate.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchProductsWithPopulate.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.productsWithPopulate = action.payload
    })
    builder.addCase(fetchProductsWithPopulate.rejected, state => {
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
    builder.addCase(fetchProductByIdWithPopulate.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchProductByIdWithPopulate.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.productWithPopulate = action.payload
    })
    builder.addCase(fetchProductByIdWithPopulate.rejected, state => {
      state.loadingFetch = false
    })
    builder.addCase(fetchProductsByClientId.pending, state => {
      state.loadingFetch = true
    })
    builder.addCase(fetchProductsByClientId.fulfilled, (state, action) => {
      state.loadingFetch = false
      state.products = action.payload
    })
    builder.addCase(fetchProductsByClientId.rejected, state => {
      state.loadingFetch = false
    })
    builder.addCase(addProduct.pending, state => {
      state.loadingAdd = true
      state.createAndUpdateError = null
    })
    builder.addCase(addProduct.fulfilled, state => {
      state.loadingAdd = false
    })
    builder.addCase(addProduct.rejected, (state, { payload: error }) => {
      state.loadingAdd = false
      state.createAndUpdateError = error || null
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
      state.createAndUpdateError = null
    })
    builder.addCase(updateProduct.fulfilled, state => {
      state.loadingUpdate = false
    })
    builder.addCase(updateProduct.rejected, (state, { payload: error }) => {
      state.loadingUpdate = false
      state.createAndUpdateError = error || null
    })
  },
})

export const productReducer = productSlice.reducer
