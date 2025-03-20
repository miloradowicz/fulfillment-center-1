export interface Client {
  _id: string
  name: string
  phone_number: string
  email: string
  inn: string
  address?: string
  banking_data?: string
  ogrn?: string
}

export type ClientMutation = Omit<Client, '_id'>

export interface GlobalError {
  message: string
}

export interface ValidationError {
  type: string
  errors: {
    [key: string]: {
      name: string
      messages: string[]
    }
  }
  message: string
  name: string
  _message: string
}

export interface DynamicField {
  key: string
  label: string
  value: string
}

export interface Log {
  user: string
  change: string
  date: string
}

export type LogWithPopulate = Omit<Log, 'user'> & {
  user: UserStripped
}

export interface Product {
  _id: string
  client: string
  title: string
  amount: number
  barcode: string
  article: string
  documents?: { document: string }[]
  dynamic_fields?: DynamicField[]
  logs?: Log[]
}

export interface ProductWithPopulate {
  _id: string
  client: Client
  title: string
  amount: number
  barcode: string
  article: string
  documents: { document: string }[]
  dynamic_fields: DynamicField[]
  logs?: Log[]
}

export type ProductMutation = Omit<Product, '_id'>

export interface Defect {
  product: string
  defect_description: string
  amount: number
}

export type DefectWithPopulate = Omit<Defect, 'product'> & {
  product: Product
}

export interface DefectMutation extends Defect {
  productName: string
}

export interface ProductOrder {
  product: string
  description: string
  amount: number
}

export type ProductOrderMutation = Omit<ProductOrder, 'product'> & {
  _id: string
  product: Product
}

export interface ProductArrival {
  product: string
  description: string
  amount: number
}

export type ProductArrivalWithPopulate = Omit<ProductArrival, 'product'> & {
  product: Product
}

export interface Arrival {
  _id: string
  client: string
  products: ProductArrival[]
  arrival_price: number
  arrival_date: string
  sent_amount: string
  stock: string
  defects: Defect[]
  arrival_status?: string
  received_amount?: ProductArrival[]
  logs?: Log[]
}

export type ArrivalWithPopulate = Omit<Arrival, 'products' | 'defects' | 'received_amount'> & {
  client: Client
  products: ProductArrivalWithPopulate[]
  defects: DefectWithPopulate[]
  received_amount?: ProductArrivalWithPopulate[]
  logs?: LogWithPopulate[]
  stock: Stock
}

export interface ArrivalWithClient extends Omit<Arrival, 'client' | 'stock'> {
  client: Client
  stock: Stock
}

export type ArrivalMutation = Omit<Arrival, '_id'>

export interface Order {
  _id: string
  client: string
  products: ProductOrder[]
  price: number
  sent_at: string
  delivered_at: string
  comment?: string
  status?: string
  logs?: Log[]
  defects: Defect[]
}

export type OrderWithProducts = Omit<Order, 'products'> & {
  products: ProductOrderMutation[]
}

export type OrderWithProductsAndClients = Omit<Order, 'products'> & {
  products: ProductForOrderForm[]
  defects: DefectForOrderForm[]
  client: Client
}

export type OrderWithClient = Omit<Order, 'client'> & {
  client: Client
}

export type OrderMutation = Omit<Order, '_id'>

export interface User {
  _id: string
  email: string
  displayName: string
  role: 'super-admin' | 'admin' | 'manager' | 'stock-worker'
  token: string
}

export type UserStripped = Omit<User, 'token'>

export type UserMutation = Omit<User, '_id' | 'token'> & {
  password: string
}

export interface LoginMutation {
  email: string
  password: string
}

export type UserRegistrationMutation = {
  email: string
  password: string
  displayName: string
  role: 'super-admin' | 'admin' | 'manager' | 'stock-worker'
}

export interface ArrivalError {
  client: string
  product: string
  arrival_price: number
  arrival_date: string
  stock: string
  amount: number
  defect_description: string
  arrival_status?:string
}

export interface ErrorForOrder {
  client: string
  product: string
  price: number
  amount: number
  defect_description: string
  sent_at: string
  delivered_at: string
  status?:string
}

export interface ProductForOrderForm {
  product: Product
  description: string
  amount: number
}

export interface DefectForOrderForm {
  product: Product
  defect_description: string
  amount: number
}

export interface Task {
  _id: string
  user: string
  title: string
  description: string
  status: string
  logs?: Log[]
}

export interface TaskWithPopulate {
  _id: string
  user: {
    _id: string
    email: string
    displayName: string
    role: string
  }
  title: string
  description: string
  status: string
  logs?: Log[]
}

export type TaskMutation = Omit<Task, '_id'>

export interface Service {
  _id: string
  name: string
  dynamic_fields: DynamicField[]
  logs?: Log[]
}

export type ServiceMutation = Omit<Service, '_id'>

export interface Stock {
  _id: string
  name: string
  address: string
}

export interface StockError {
  name: string
  address: string
}

export type StockMutation = Omit<Stock, '_id'>
