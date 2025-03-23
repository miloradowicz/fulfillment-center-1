export const getStatusStyles = (status: string) => {
  switch (status) {
  case 'к выполнению':
    return {
      backgroundColor: '#D1D3D8',
      color: '#6B7280',
    }
  case 'в работе':
    return {
      backgroundColor: '#0052CC',
      color: '#FFFFFF',
    }
  case 'готово':
    return {
      backgroundColor: '#36B37E',
      color: '#FFFFFF',
    }
  default:
    return {
      backgroundColor: '#f7f7f7',
      color: '#000000',
    }
  }
}
