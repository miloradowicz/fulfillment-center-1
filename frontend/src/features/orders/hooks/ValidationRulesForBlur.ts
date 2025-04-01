export const validationRules: Record<string, (value: string) => string | null> = {
  price: value => (Number(value) <= 0 ? 'Сумма заказа должна быть больше 0' : null),
  amount: value => (Number(value) <= 0 ? 'Количество товара должно быть больше 0' : null),
}
