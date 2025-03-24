export const getProductNameById = <T extends { _id: string; title: string }>(
  products: T[] | null | undefined,
  productId: string,
): string => {
  if (!products) return 'Неизвестный товар'
  const product = products.find(p => p._id === productId)
  return product ? product.title : 'Неизвестный товар'
}
