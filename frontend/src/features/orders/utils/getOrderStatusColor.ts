export  const getOrderStatusColor = (status: string) => {
  switch (status) {
  case 'в сборке':
    return 'warning'
  case 'в пути':
    return 'info'
  case 'доставлен':
    return 'success'
  default:
    return 'warning'
  }
}

export const getArrivalStatusColor = (status: string) => {
  switch (status) {
  case 'ожидается доставка':
    return 'warning'
  case 'отсортирована':
    return 'info'
  case 'получена':
    return 'success'
  default:
    return 'warning'
  }
}
