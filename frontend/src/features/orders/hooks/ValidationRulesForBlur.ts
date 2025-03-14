export const validationRules: Record<string, (value: string) => string | null> = {
  price: value => (Number(value) <= 0 ? 'Поле сумма заказа должно быть больше 0' : null),
  amount: value => (Number(value) <= 0 ? 'Поле количество товара должно быть больше 0' : null),
};
