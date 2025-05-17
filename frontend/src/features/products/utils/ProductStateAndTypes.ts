import { DynamicField, ProductMutation } from '@/types'

export const initialProductState: ProductMutation = {
  client: '',
  title: '',
  barcode: '',
  article: '',
  dynamic_fields: [],
}

export const dynamicFieldState: DynamicField = {
  key: '',
  label: '',
  value: '',
}

export interface ErrorProduct {
  client: string,
  title: string,
  barcode:string,
  article:string,
}

export const initialErrorProductState = {
  client: '',
  title: '',
  barcode:'',
  article:'',
}
