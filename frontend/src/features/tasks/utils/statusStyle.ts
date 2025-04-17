export const getStatusStyles = (status: string) => {
  switch (status) {
  case 'к выполнению':
    return 'bg-gray-100 text-gray-700'
  case 'в работе':
    return 'bg-blue-100 text-blue-700'
  case 'готово':
    return 'bg-emerald-100 text-emerald-700'
  default:
    return 'bg-neutral-100 text-black'
  }
}

