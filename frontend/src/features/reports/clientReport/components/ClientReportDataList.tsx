import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useSearchParams } from 'react-router-dom'
import { formatDate } from '@/features/reports/utils/FormattedDateForTitle.ts'
import DataTable from '@/components/DataTable/DataTable'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader'
import { PropsClientTable } from '../../utils/TypesProps.ts'
import { ClientFullReport } from '@/types'
import Dropdown from '@/features/reports/components/DropDown.tsx'

const ClientReportDataList: React.FC<PropsClientTable> = ({ ClientFullReport }) => {
  const [searchParams] = useSearchParams()
  const startDate = formatDate(searchParams.get('startDate'))
  const endDate = formatDate(searchParams.get('endDate'))

  const columns: ColumnDef<ClientFullReport>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'client',
      accessorFn: row => row.client.name,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Клиент"/>,
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.client.name}
          {row.original.client.isArchived && (
            <div className="text-muted-foreground text-xs">(в архиве)</div>
          )}
        </div>
      ),
      enableColumnFilter: true,
    },
    {
      accessorKey: 'orderCount',
      header: ({ column }) => <DataTableColumnHeader column={column} className={'w-40'} title="Всего заказов"/>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.orders.length}
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'orders',
      header: () => (
        <div className="text-center">
          Заказы
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.orders.length === 0 ? (
            <div className="h-[38px] flex items-center justify-center">-</div>
          ) : (
            <Dropdown
              items={row.original.orders}
              getLabel={order => `${ order.orderNumber }${ order.isArchived ? ' (в архиве)' : '' }`}
              getLink={order => `/orders/${ order._id }`}
              getStatus={order => order.status}
              statusFilterOptions={['в сборке', 'в пути', 'доставлен']}
            />
          )}
        </div>
      ),
    },
    {
      accessorKey: 'arrivalCount',
      header: ({ column }) => <DataTableColumnHeader column={column} className={'w-40'} title="Всего поставок"/>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.arrivals.length}
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'arrivals',
      header: () => (
        <div className="text-center">
          Поставки
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.arrivals.length === 0 ? (
            <div className="h-[38px] flex items-center justify-center">-</div>
          ) : (
            <Dropdown
              items={row.original.arrivals}
              getLabel={arrival => `${ arrival.arrivalNumber }${ arrival.isArchived ? ' (в архиве)' : '' }`}
              getLink={arrival => `/arrivals/${ arrival._id }`}
              getStatus={arrival => arrival.arrival_status}
              statusFilterOptions={['ожидается доставка', 'получена', 'отсортирована']}
            />
          )}
        </div>
      ),
    },
    {
      accessorKey: 'invoicesCount',
      header: ({ column }) => <DataTableColumnHeader column={column} className={'w-40'} title="Всего счетов"/>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.invoices.length}
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'invoices',
      header: () => (
        <div className="text-center">
          Счета
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.invoices.length === 0 ? (
            <div className="h-[38px] flex items-center justify-center">-</div>
          ) : (
            <Dropdown
              items={row.original.invoices}
              getLabel={invoice => `${ invoice.invoiceNumber }${ invoice.isArchived ? ' (в архиве)' : '' }`}
              getLink={invoice => `/invoices/${ invoice._id }`}
              getStatus={invoice => invoice.status}
              statusFilterOptions={['в ожидании', 'частично оплачено', 'оплачено']}
            />
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="max-w-full overflow-x-auto mt-3 ">
      <h6 className="text-center text-base sm:text-xl mx-auto mb-3 break-words w-[80%]">
        Количество заказов каждого клиента за период с {startDate} по {endDate}
      </h6>
      <DataTable columns={columns} data={ClientFullReport ?? []} />
    </div>
  )
}

export default ClientReportDataList
