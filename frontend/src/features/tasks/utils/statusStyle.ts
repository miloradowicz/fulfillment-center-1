export const getStatusStyles = (status: string) => {
  switch (status) {
  case 'к выполнению':
    return {
      backgroundColor: '#091E420F',
      color: '#42526E',
    }
  case 'в работе':
    return {
      backgroundColor: '#E9F2FF',
      color: '#0052CC',
    }
  case 'готово':
    return {
      backgroundColor: '#DCFFF1',
      color: '#216E4E',
    }
  default:
    return {
      backgroundColor: '#f7f7f7',
      color: '#000000',
    }
  }
}
