import { Defect, ProductArrival, ProductOrder, ServiceArrival, ServiceOrder } from '@/types'
import { Button } from '@/components/ui/button.tsx'
import { Trash2 } from 'lucide-react'

type Item = ProductArrival | Defect | ServiceArrival | ProductOrder | ServiceOrder

interface Props<T extends Item> {
  items: T[]
  onDelete: (index: number) => void
  getNameById?: (id: string) => string
}

function isDefect(item: Item): item is Defect {
  return 'product' in item && 'defect_description' in item
}

function isProduct(item: Item): item is ProductArrival | ProductOrder {
  return 'product' in item && 'description' in item
}

function isService(item: Item): item is ServiceArrival | ServiceOrder {
  return 'service' in item
}

const ItemsList = <T extends Item>({ items, onDelete, getNameById }: Props<T>) => {
  const getItemText = (item: Item) => {
    let mainText = ''
    let amountText = ''
    let servicePrice = ''

    if (isDefect(item) || isProduct(item)) {
      mainText = getNameById?.(item.product) || ''
      amountText = `x ${ item.amount }`
    } else if (isService(item)) {
      mainText = getNameById?.(item.service) || ''
      amountText = `x ${ item.service_amount }`
      servicePrice = `${ item.service_price }`
    }

    return { mainText, amountText, servicePrice }
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const { mainText, amountText, servicePrice } = getItemText(item)

        return (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex-1 flex items-center justify-between gap-2 p-2 border rounded-md bg-muted shadow-sm min-w-0">
              <span className="font-semibold text-sm truncate">{mainText}{servicePrice && `, ${ servicePrice }`}</span>
              <span className="text-sm font-bold whitespace-nowrap">{amountText}</span>
            </div>

            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(i)}
            >
              <Trash2 size={15} />
            </Button>
          </div>
        )
      })}
    </div>
  )

}

export default ItemsList
