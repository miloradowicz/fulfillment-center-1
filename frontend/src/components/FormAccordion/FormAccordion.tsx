import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import ItemsList from '@/components/ItemsList/ItemsList.tsx'
import { Defect, ProductArrival, ProductOrder, ServiceArrival, ServiceOrder, WriteOff } from '@/types'

type Item = ProductArrival | Defect | ServiceArrival | ProductOrder | ServiceOrder | WriteOff

interface TypedAccordionProps<T extends Item> {
  title: string
  items: T[]
  onDelete: (index: number) => void
  getNameById?: (id: string) => string
}

const FormAccordion = <T extends Item>({ title, items, onDelete, getNameById }: TypedAccordionProps<T>) => {
  const hasAnyItems = items.length > 0

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" onClick={e => e.stopPropagation()}>
        <AccordionTrigger className="font-bold mt-0 mb-2.5 p-0">{title}</AccordionTrigger>
        {hasAnyItems ? (
          <AccordionContent>
            <ItemsList<T> items={items} onDelete={onDelete} getNameById={getNameById} />
          </AccordionContent>
        ) : null}
      </AccordionItem>
    </Accordion>
  )
}

export default FormAccordion
