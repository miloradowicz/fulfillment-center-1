import { createAsyncThunk } from '@reduxjs/toolkit'
import axiosAPI from '../../utils/axiosAPI.ts'
import { GlobalError, Product, ProductMutation, ProductWithPopulate } from '../../types'
import axios, { isAxiosError } from 'axios'

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

export const addProduct = createAsyncThunk<Product, ProductMutation | FormData, { rejectValue: GlobalError }>(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axiosAPI.post('/products', productData, {
        headers: productData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err: GlobalError = {
          message: error.response?.data?.message || 'Ошибка сервера',
        }
        return rejectWithValue(err)
      }
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

export const updateProduct = createAsyncThunk<void, { productId: string; data: ProductMutation }, { rejectValue: GlobalError }>(
  'products/updateProduct',
  async ({ productId, data }, { rejectWithValue }) => {
    try {
      await axiosAPI.put(`/products/${ productId }`, data)
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        return rejectWithValue(e.response.data as GlobalError)
      }
      throw e
    }
  },
)
