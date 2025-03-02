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
