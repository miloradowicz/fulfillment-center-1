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
