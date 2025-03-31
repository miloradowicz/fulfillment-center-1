import mongoose from 'mongoose'

type StockProductType = {
  product: mongoose.Schema.Types.ObjectId;
  amount: number;
}


export const removeStockProducts = <T extends StockProductType>(
  stock: { products: T[] },
  receivedAmount: T[]
): void  => {
  for (const receivedProduct of receivedAmount) {
    const stockProductIndex = stock.products.findIndex(
      p => JSON.stringify(p.product) === JSON.stringify(receivedProduct.product)
    )
    if (stockProductIndex === -1) continue

    const stockProduct = stock.products[stockProductIndex]

    stockProduct.amount -= receivedProduct.amount

    if (stockProduct.amount <= 0) {
      stock.products.splice(stockProductIndex, 1)
    }
  }
}

export const updateStockProducts = <T extends StockProductType>(
  stock: { products: T[] },
  receivedProducts: T[]
): void => {
  for (const receivedProduct of receivedProducts) {
    const existingProduct = stock.products.find(
      p => JSON.stringify(p.product) === JSON.stringify(receivedProduct.product)
    )

    if (existingProduct) {
      existingProduct.amount += receivedProduct.amount
    } else {
      stock.products.push({
        product: receivedProduct.product,
        amount: receivedProduct.amount,
      } as T)
    }
  }
}

export function updateDefects<T extends StockProductType>(
  stock: { products: T[] },
  defects: T[]
): void {
  for (const defect of defects) {
    const stockProductIndex = stock.products.findIndex(
      p => JSON.stringify(p.product) === JSON.stringify(defect.product)
    )
    if (stockProductIndex === -1) continue

    const stockProduct = stock.products[stockProductIndex]

    stockProduct.amount -= defect.amount

    if (stockProduct.amount <= 0) {
      stock.products.splice(stockProductIndex, 1)
    }
  }
}

export function removeDefects<T extends StockProductType>(
  stock: { products: T[] },
  defects: T[]
): void {
  for (const defect of defects) {
    const stockProductIndex = stock.products.findIndex(
      p => JSON.stringify(p.product) === JSON.stringify(defect.product)
    )
    if (stockProductIndex === -1) continue

    const stockProduct = stock.products[stockProductIndex]

    stockProduct.amount += defect.amount
  }
}
