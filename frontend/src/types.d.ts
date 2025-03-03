export interface Client {
  _id: string;
  full_name: string;
  phone_number: string;
  email: string;
  inn: string;
  address?: string;
  company_name?: string;
  banking_data?: string;
  ogrn?: string;
}

export type ClientMutation = Omit<Client, '_id'>;

export interface GlobalError {
  message: string;
}

export interface DynamicField {
  key: string;
  label: string;
  value: string;
}

export interface Log {
  user: string;
  change: string;
  date: string;
}

export interface Product {
  _id: string;
  client: string;
  title: string;
  amount: number;
  barcode: string;
  article: string;
  documents?: { document: string }[];
  dynamic_fields?: DynamicField[];
  logs?: Log[];
}

export type ProductMutation = Omit<Product, '_id'>;

export interface Defect {
  product: string;
  defect_description: string;
  amount: number;
}

export interface ProductArrival {
  product: string;
  description: string;
  amount: number;
}

export interface Arrival {
  _id: string;
  client: string;
  products: ProductArrival[];
  arrival_price: number;
  arrival_status: 'Ожидается доставка' | 'Получен' | 'Отсортирован';
  arrival_date: string;
  created_at: string;
  updated_at?: string;
  sent_amount: string;
  logs?: Log[];
  defects?: Defect[];
  received_amount?: number;
}

export type ArrivalMutation = Omit<Arrival, '_id'>;

export interface Order {
  _id: string;
  client: string;
  products: Product[];
  price: number;
  sent_at: string;
  delivered_at: string;
  comment?: string;
  status: 'в сборке' | 'в пути' | 'доставлен';
  logs?: Log[];
  defects?: Defect[];
}

export type OrderMutation = Omit<Order, '_id'>;


