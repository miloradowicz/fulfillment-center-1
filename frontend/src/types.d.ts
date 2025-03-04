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

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      messages: string;
    }
  },
  message: string;
  name: string;
  _message: string;
}

export interface DynamicField {
  key: string;
  label: string;
  value: string;
}

export interface Log {
  user: string;
  change: string;
  date: Date;
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
  arrival_date: string;
  sent_amount: string;
  defects: Defect[];
  arrival_status?: string;
  received_amount?: ProductArrival[];
}

export type ArrivalMutation = Omit<Arrival, '_id'>;
