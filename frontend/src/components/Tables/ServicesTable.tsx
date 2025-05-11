import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Service, ServiceInTable } from '@/types'
import React from 'react'

interface Props {
  services?: ServiceInTable[]
}

const ServicesTable: React.FC<Props> = ({ services }) => {
  const getServiceName = (service: string | Service): string => {
    return typeof service === 'string' ? service : service.name
  }

  const getServiceCategory = (service: string | Service): string => {
    return typeof service === 'string' ? 'Неизвестная категория' : service.serviceCategory?.name
  }

  return (
    services?.length ? (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Название услуги</TableHead>
            <TableHead className="font-bold">Категория</TableHead>
            <TableHead className="font-bold">Количество</TableHead>
            <TableHead className="font-bold">Стоимость</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service, index) => (
            <TableRow key={service._id || index}>
              <TableCell className="max-w-[200px] whitespace-normal break-words">{getServiceName(service.service)}</TableCell>
              <TableCell className="max-w-[200px] whitespace-normal break-words">{getServiceCategory(service.service)}</TableCell>
              <TableCell>{service.service_amount ?? 0}</TableCell>
              <TableCell>{service.service_price ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <p className="text-muted-foreground font-bold text-center text-sm py-4">
        Услуги отсутствуют.
      </p>
    )
  )
}

export default ServicesTable
