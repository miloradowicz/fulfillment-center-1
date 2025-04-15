import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useSearchParams } from 'react-router-dom'
import { formatDate } from '@/features/reports/utils/FormattedDateForTitle.ts'
import DataTable from '@/components/DataTable/DataTable'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader'
import { PropsClientTable } from '../../utils/TypesProps.ts'
import { ClientOrderReport } from '@/types'
import Dropdown from '@/features/reports/components/Drop.tsx'

const ClientReportDataList: React.FC<PropsClientTable> = ({ clientOrderReport }) => {
  const [searchParams] = useSearchParams()
  const startDate = formatDate(searchParams.get('startDate'))
  const endDate = formatDate(searchParams.get('endDate'))

  const columns: ColumnDef<ClientOrderReport>[] = [
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
      id: 'orders',
      header: () => (
        <div className="text-center">
          Заказы
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.orderCount === 0 ? (
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
      accessorKey: 'orderCount',
      header: ({ column }) => <DataTableColumnHeader column={column} className={'w-40'} title="Количество заказов"/>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.orderCount}
        </div>
      ),
      enableSorting: true,
    },
  ]

  return (
    <div className="w-full max-w-[1000px] mx-auto px-2 sm:px-4 space-y-4">
      <h6 className="text-center text-base sm:text-xl mx-auto break-words w-[80%]">
        Количество заказов каждого клиента за период с {startDate} по {endDate}
      </h6>

      <div className="overflow-x-auto">
        <DataTable columns={columns} data={clientOrderReport ?? []} />
      </div>
    </div>
  )
}

export default ClientReportDataList
