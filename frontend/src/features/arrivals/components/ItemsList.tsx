import { Defect, ProductArrival, ServiceArrival } from '@/types'
import { Separator } from '@/components/ui/separator.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Trash } from 'lucide-react'

type Item = ProductArrival | Defect | ServiceArrival

interface Props<T extends Item> {
  items: T[]
  onDelete: (index: number) => void
  getNameById?: (id: string) => string
}

function isDefect(item: Item): item is Defect {
  return 'product' in item && 'defect_description' in item
}

function isProduct(item: Item): item is ProductArrival {
  return 'product' in item && 'description' in item
}

function isService(item: Item): item is ServiceArrival {
  return 'service' in item
}

const ItemsList = <T extends Item>({ items, onDelete, getNameById }: Props<T>) => {
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="flex mb-5">
          <div className="flex-col space-y-2">
            <p className="font-bold text-sm">
              {isDefect(item) || isProduct(item)
                ? getNameById?.(item.product)
                : isService(item)
                  ? getNameById?.(item.service)
                  : ''}
            </p>

            <p className="text-sm">
              {isDefect(item) || isProduct(item)
                ? `Количество: ${ item.amount }`
                : isService(item)
                  ? `Количество: ${ item.service_amount }`
                  : ''}
            </p>

            {isDefect(item) && (
              <p className="text-sm">
                  Дефект: {item.defect_description}
              </p>
            )}

            {isService(item) && (
              <p className="text-sm">
                {item.service_price ? `Цена услуги: ${ item.service_price }` : null}
              </p>
            )}

            <div>
              <Button className="bg-destructive/20 text-destructive hover:bg-destructive/30" onClick={() => onDelete(i)}>
                <Trash size={15}/>
              </Button>
            </div>
          </div>

          {items.length > 1 ? <Separator /> : null}
        </div>
      ))}
    </>
  )
}

export default ItemsList
