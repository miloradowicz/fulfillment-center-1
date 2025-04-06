import { GlobalError, Product, ProductWithPopulate, ValidationError } from '../../types'
import { createSlice } from '@reduxjs/toolkit'
import {
  addProduct,
  deleteProduct,
  fetchProductsByClientId,
  fetchProductById,
  fetchProducts,
  updateProduct, fetchProductsWithPopulate, fetchProductByIdWithPopulate,
  archiveProduct,
  fetchArchivedProducts, unarchiveProduct,
} from '../thunks/productThunk.ts'
import { RootState } from '../../app/store.ts'

interface ProductState {
  product: Product | null
  archivedProduct: Product | null
  productWithPopulate: ProductWithPopulate | null
  productsWithPopulate: ProductWithPopulate[] | null
  products: Product[] | null
  archivedProducts: ProductWithPopulate[] | null
  loadingFetch: boolean
  loadingFetchArchive: boolean
  loadingFetchOneClient: boolean
  loadingAdd: boolean
  loadingArchive: boolean
  loadingUnarchive: boolean
  loadingDelete: boolean
  loadingUpdate: boolean
  error: GlobalError | null
  createAndUpdateError: ValidationError | null
  deleteError: GlobalError | null
}

const initialState: ProductState = {
  product: null,
  archivedProduct: null,
  productWithPopulate: null,
  productsWithPopulate: null,
  products: null,
  archivedProducts: null,
  loadingFetch: false,
  loadingFetchArchive: false,
  loadingFetchOneClient: false,
  loadingAdd: false,
  loadingArchive: false,
  loadingUnarchive: false,
  loadingDelete: false,
  loadingUpdate: false,
  error: null,
  createAndUpdateError: null,
  deleteError: null,
}

export const selectProduct = (state: RootState) => state.products.product
export const selectArchivedProduct = (state: RootState) => state.products.archivedProduct
export const selectAllProducts = (state: RootState) => state.products.products
export const selectAllArchivedProducts = (state: RootState) => state.products.archivedProducts
export const selectProductWithPopulate = (state: RootState) => state.products.productWithPopulate
export const selectProductsWithPopulate = (state: RootState) => state.products.productsWithPopulate
export const selectLoadingFetchProduct = (state: RootState) => state.products.loadingFetch
export const selectLoadingFetchArchivedProduct = (state: RootState) => state.products.loadingFetch
export const selectLoadingAddProduct = (state: RootState) => state.products.loadingAdd
export const selectLoadingArchiveProduct = (state: RootState) => state.products.loadingArchive
export const selectLoadingDeleteProduct = (state: RootState) => state.products.loadingDelete
export const selectLoadingUpdateProduct = (state: RootState) => state.products.loadingUpdate
export const selectProductError = (state: RootState) => state.products.error
export const selectCreateProductError = (state: RootState) => state.products.createAndUpdateError
export const selectDeleteProductError = (state: RootState) => state.products.deleteError

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearErrorProduct: state => {
      state.createAndUpdateError = null
      state.deleteError = null
      state.error = null
    },
  },
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
    builder.addCase(fetchArchivedProducts.pending, state => {
      state.loadingFetchArchive = true
    })
    builder.addCase(fetchArchivedProducts.fulfilled, (state, action) => {
      state.loadingFetchArchive = false
      state.archivedProducts = action.payload
    })
    builder.addCase(fetchArchivedProducts.rejected, state => {
      state.loadingFetchArchive = false
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
    builder.addCase(archiveProduct.pending, state => {
      state.loadingArchive = true
      state.error = null
    })
    builder.addCase(archiveProduct.fulfilled, state => {
      state.loadingArchive = false
      state.error = null
    })
    builder.addCase(archiveProduct.rejected, (state, { payload: error }) => {
      state.loadingArchive = false
      state.error = error || null
    })
    builder.addCase(unarchiveProduct.pending, state => {
      state.loadingUnarchive = true
      state.error = null
    })
    builder.addCase(unarchiveProduct.fulfilled, (state, action) => {
      state.loadingUnarchive = false
      state.error = null

      if (state.archivedProducts) {
        state.archivedProducts = state.archivedProducts.filter(product => product._id !== action.payload.id)
      }
    })
    builder.addCase(unarchiveProduct.rejected, (state, { payload: error }) => {
      state.loadingUnarchive = false
      state.error = error || null
    })
    builder.addCase(deleteProduct.pending, state => {
      state.loadingDelete = true
      state.deleteError = null
    })
    builder.addCase(deleteProduct.fulfilled, state => {
      state.loadingDelete = false
      state.deleteError = null
    })
    builder.addCase(deleteProduct.rejected, (state, { payload: error }) => {
      state.loadingDelete = false
      state.deleteError = error || null
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
export const { clearErrorProduct } = productSlice.actions
