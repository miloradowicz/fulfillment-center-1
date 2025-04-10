import { Defect, DefectForOrderForm, Product, ProductForOrderForm, ProductOrder } from '@/types'
import React from 'react'
import { toast } from 'react-toastify'

export const addArrayItemInForm = <
  T extends ProductOrder | Defect,
  U extends ProductForOrderForm | DefectForOrderForm
>(
    newField: T,
    setForm: React.Dispatch<React.SetStateAction<U[]>>,
    setArrayData: () => void,
    clientProducts: Product[] | null,
    amountField: keyof T,
    descriptionField: keyof T,
    productField: keyof T,
  ) => {
  if (clientProducts) {
    for (let i = 0; i < clientProducts.length; i++) {
      if (newField[productField] === clientProducts[i]._id) {
        if(Number(newField[amountField]) === 0){
          toast.warn('Заполните количество товара.')
          return
        }
        else if(
          descriptionField === 'defect_description' && !newField[descriptionField]
        ){
          toast.warn('Заполните описание дефекта.')
          return
        }else {
          setForm(prev => [
            ...prev,
            {
              product: clientProducts[i],
              [amountField]: Number(newField[amountField]),
              [descriptionField]: newField[descriptionField],
            } as unknown as U,
          ])
        }
      }
    }
    setArrayData()
  }
}
