import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosAPI from '@/utils/axiosAPI.ts'
import { GlobalError, Product, ProductMutation, ProductWithPopulate, ValidationError } from '@/types'
import { isAxiosError } from 'axios'

export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchProducts',
  async () => {
    const response = await axiosAPI.get('/products')
    return response.data
  },
)

export const fetchProductById = createAsyncThunk<Product, string>(
  'products/fetchProductById',
  async (productId: string) => {
    const response = await axiosAPI.get(`/products/${ productId }`)
    return response.data
  },
)

export const fetchProductByIdWithPopulate = createAsyncThunk<ProductWithPopulate, string>(
  'products/fetchProductByIdWithPopulate',
  async (productId: string) => {
    const response = await axiosAPI.get(`/products/${ productId }?populate=1`)
    return response.data
  },
)

export const fetchProductsByClientId = createAsyncThunk<Product[], string>(
  'products/fetchByClientId',
  async(clientId: string) => {
    const response = await axiosAPI.get(`/products?client=${ clientId }`)
    return response.data
  },
)

export const fetchProductsWithPopulate = createAsyncThunk<ProductWithPopulate[]>(
  'products/fetchProductsWithPopulate',
  async() => {
    const response = await axiosAPI.get('/products?populate=1')
    return response.data
  },
)

export const addProduct = createAsyncThunk<Product, ProductMutation, { rejectValue: ValidationError }>(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.post('/products', productData)
      return response.data
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as ValidationError)
      }
      throw e
    }
  },
)

export const archiveProduct = createAsyncThunk<{ id: string }, string, { rejectValue: GlobalError }>(
  'products/archiveProduct',
  async (productId: string, { rejectWithValue }) => {
    try {
      await axiosAPI.patch(`/products/${ productId }/archive`)
      return { id: productId }
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)

export const deleteProduct = createAsyncThunk<void, string, { rejectValue: GlobalError }
>('products/deleteProduct', async (productId: string, { rejectWithValue }) => {
  try {
    await axiosAPI.delete(`/products/${ productId }`)
  } catch (e) {
    if (isAxiosError(e) && e.response) {
      return rejectWithValue(e.response.data as GlobalError)
    }
    throw e
  }
})

export const updateProduct = createAsyncThunk<void, { productId: string; data: ProductMutation }, { rejectValue: ValidationError }>(
  'products/updateProduct',
  async ({ productId, data }, { rejectWithValue }) => {
    try {
      await axiosAPI.put(`/products/${ productId }`, data)
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as ValidationError)
      }
      throw e
    }
  },
)
