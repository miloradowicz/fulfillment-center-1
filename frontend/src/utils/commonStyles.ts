export const tabTriggerStyles =
'data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/5 hover:text-primary px-3 py-1 my-1 text-sm sm:text-base rounded-2xl transition-all cursor-pointer'

export const arrivalStatusStyles: Record<string, string> = {
  'ожидается доставка': 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 hover:text-yellow-800 transition-colors font-bold',
  'получена': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-900 transition-colors font-bold',
  'отсортирована': 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900 transition-colors font-bold',
  'default': 'bg-primary/10 text-primary/80 border hover:bg-primary/20 hover:text-primary transition-colors',
}

export const orderStatusStyles: Record<string, string> = {
  'в сборке':
    'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 hover:text-yellow-800 transition-colors rounded-lg font-bold',
  'в пути':
    'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900 transition-colors rounded-lg font-bold',
  'доставлен':
    'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-900 transition-colors rounded-lg font-bold',
  default: 'bg-primary/10 text-primary/80 border font-bold hover:bg-primary/20 hover:text-primary transition-colors',
}

export const invoiceStatusStyles: Record<'в ожидании' | 'оплачено' | 'частично оплачено', string> = {
  'в ожидании':
    'bg-yellow-100 text-yellow-600 rounded-lg font-bold px-4 py-2',
  'оплачено':
    'bg-emerald-100 text-emerald-700 transition-colors rounded-lg font-bold px-4 py-2',
  'частично оплачено':
    'bg-indigo-100 text-indigo-700 rounded-lg font-bold px-4 py-2',
}
