import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Invoice } from '@/types'
import { formatMoney } from '@/utils/formatMoney.ts'

const InvoiceServicesTable = ({
  services,
}: {
  services: Invoice['services']
  discount?: number
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="font-bold">Услуга</TableHead>
        <TableHead className="font-bold">Тип</TableHead>
        <TableHead className="font-bold">Кол-во</TableHead>
        <TableHead className="font-bold">Цена</TableHead>
        <TableHead className="font-bold">Сумма</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {services.map((item, index) => {
        const amount = item.service_amount ?? 1
        const unitPrice = item.service_price ?? item.service.price
        const sum = amount * unitPrice

        return (
          <TableRow key={`${ item.service._id }-${ index }`}>
            <TableCell className="font-medium whitespace-normal break-words max-w-[200px]">
              {item.service.name}
            </TableCell>
            <TableCell className="capitalize">{item.service_type}</TableCell>
            <TableCell>{amount}</TableCell>
            <TableCell>{formatMoney(unitPrice)} ₽</TableCell>
            <TableCell>{formatMoney(sum)} ₽</TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  </Table>
)

export default InvoiceServicesTable
