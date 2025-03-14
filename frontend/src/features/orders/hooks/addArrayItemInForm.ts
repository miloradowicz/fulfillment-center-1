import React from 'react'
import { Product } from '../../../types'

export const addArrayItemInForm = (
  newField: any,
  setForm: React.Dispatch<React.SetStateAction<any[]>>,
  setArrayData: () => void,
  clientProducts: Product[] | null,
  amountField: string,
  descriptionField: string,
  productField: string,
) => {
  if (clientProducts) {
    for (let i = 0; i < clientProducts.length; i++) {
      if (newField[productField] === clientProducts[i]._id) {
        setForm(prev => [
          ...prev,
          {
            product: clientProducts[i],
            [amountField]: Number(newField[amountField]),
            [descriptionField]: newField[descriptionField],
          },
        ])
      }
    }
    setArrayData()
  }
}

