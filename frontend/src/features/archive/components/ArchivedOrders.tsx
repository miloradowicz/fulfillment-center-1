import dayjs from 'dayjs'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { useArchivedOrdersActions } from '../hooks/useArchivedOrdersActions'
import { OrderWithClient } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'

const ArchivedOrders = () => {
  const {
    orders,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  } = useArchivedOrdersActions()


  const columns: ColumnDef<OrderWithClient>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'orderNumber',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Номер заказа" />,
      cell: ({ row }) => {
        const tableOrder = row.original

        return (
          <div
            className="inline-block text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 transition-colors px-3 py-1.5 rounded-lg shadow-sm"
          >
            {tableOrder.orderNumber}
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: 'client.name',
      header: 'Клиент',
      cell: ({ row }) => row.original.client?.name ?? 'Неизвестный клиент',
    },
    {
      accessorKey: 'stock.name',
      header: 'Склад',
      cell: ({ row }) => row.original.stock?.name ?? 'Неизвестный склад',
    },
    {
      accessorKey: 'sent_at',
      header: 'Отправлен',
      cell: ({ row }) => dayjs(row.original.sent_at).format('DD.MM.YYYY'),
    },
    {
      accessorKey: 'delivered_at',
      header: 'Доставлен',
      cell: ({ row }) =>
        row.original.delivered_at ? dayjs(row.original.delivered_at).format('DD.MM.YYYY') : 'Не доставлен',
    },
    {
      accessorKey: 'price',
      header: 'Стоимость',
      cell: ({ row }) => row.original.price,
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => {
        const status = row.original.status

        const statusStyles: Record<'в сборке' | 'доставлен' | 'в пути', string> = {
          'в сборке':
            'bg-yellow-100 text-yellow-600 rounded-lg font-bold px-4 py-2',
          'доставлен':
            'bg-emerald-100 text-emerald-700 transition-colors rounded-lg font-bold px-4 py-2',
          'в пути':
            'bg-indigo-100 text-indigo-700 rounded-lg font-bold px-4 py-2',
        }

        const capitalizeFirstLetter = (str: string) => {
          return str.charAt(0).toUpperCase() + str.slice(1)
        }

        const statusClass = statusStyles[status as keyof typeof statusStyles] || 'bg-primary/10 text-primary/80 border font-bold px-4 py-2'

        return (
          <span className={statusClass}>
            {capitalizeFirstLetter(status as string)}
          </span>
        )
      },
    },
    {
      accessorKey: 'products',
      header: 'Товаров',
      cell: ({ row }) => row.original.products.length,
    },
    {
      id: 'actions',
      header: 'Действия',
      enableGlobalFilter: false,
      enableHiding: false,
      cell: ({ row }) => {
        const tableOrder = row.original

        return (
          <TableArchivedActionsMenu<OrderWithClient>
            row={tableOrder}
            onDelete={id => handleConfirmationOpen(id, 'delete')}
            onRestore={id => handleConfirmationOpen(id, 'unarchive')}
          />
        )
      },
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={orders ?? []}/>

      <ConfirmationModal
        open={confirmationOpen}
        entityName="этот счет"
        actionType={actionType}
        onConfirm={handleConfirmationAction}
        onCancel={handleConfirmationClose}
      />
    </div>
  )
}

export default ArchivedOrders
