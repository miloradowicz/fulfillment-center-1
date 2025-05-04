import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import ItemsList from '@/features/arrivals/components/ItemsList'
import { Defect, ProductArrival, ProductOrder, ServiceArrival, ServiceOrder, WriteOff } from '@/types'

type Item = ProductArrival | Defect | ServiceArrival | ProductOrder | ServiceOrder | WriteOff

interface TypedAccordionProps<T extends Item> {
  title: string
  items: T[]
  onDelete: (index: number) => void
  getNameById?: (id: string) => string
}

const FormAccordion = <T extends Item>({ title, items, onDelete, getNameById }: TypedAccordionProps<T>) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-bold mt-0 mb-2.5 p-0">{title}</AccordionTrigger>
        {items && (
          <AccordionContent>
            <ItemsList<T> items={items} onDelete={onDelete} getNameById={getNameById} />
          </AccordionContent>
        )}
      </AccordionItem>
    </Accordion>
  )
}

export default FormAccordion
