import { Options } from 'check-password-strength'

export const emailRegex = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/
export const phoneNumberRegex = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?(\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4})$/

export const roles = [
  { name: 'super-admin', title: 'Супер-пользователь' },
  { name: 'admin', title: 'Администратор' },
  { name: 'manager', title: 'Менеджер' },
  { name: 'stock-worker', title: 'Складской работник' },
]

export const initialClientState = {
  name: '',
  phone_number: '',
  email: '',
  inn: '',
  address: '',
  banking_data: '',
  ogrn: '',
}

export const passwordStrengthOptions: Options<string> = [
  {
    id: 0,
    value: 'Too weak',
    minDiversity: 0,
    minLength: 0,
  },
  {
    id: 1,
    value: 'Alright',
    minDiversity: 4,
    minLength: 8,
  },
]
