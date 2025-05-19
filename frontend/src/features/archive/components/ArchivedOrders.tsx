import dayjs from 'dayjs'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { useArchivedOrdersActions } from '../hooks/useArchivedOrdersActions'
import { OrderWithClient } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'
import { StatusBadge } from '@/components/StatusBadge/StatusBadge.tsx'
import { NumberBadge } from '@/components/NumberBadge/NumberBadge.tsx'
import { useSkeletonTableRows } from '@/features/archive/hooks/useTableSkeleton.ts'

const ArchivedOrders = () => {
  const {
    orders,
    loading,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  } = useArchivedOrdersActions()

  const skeletonRows = useSkeletonTableRows<OrderWithClient>(
    {
      _id: '',
      orderNumber: '',
      client: { name: '', _id: '', inn: '', address: '', ogrn: '', email: '', phone_number: '' },
      stock: { name: '', _id: '', address: '' },
      sent_at: '',
      delivered_at: '',
      price: 0,
      status: '',
    },
    orders?.length || 3,
  )

  const columns: ColumnDef<OrderWithClient & { isSkeleton?: boolean }>[] = [
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
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-9 w-20 bg-muted rounded-md animate-pulse" />
        ) : (
          <NumberBadge number={row.original.orderNumber} />
        ),
      enableHiding: false,
    },
    {
      accessorKey: 'client.name',
      header: 'Клиент',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-4 w-26 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.client?.name ?? 'Неизвестный клиент'
        ),
    },
    {
      accessorKey: 'stock.name',
      header: 'Склад',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-4 w-30 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.stock?.name ?? 'Неизвестный склад'
        ),
    },
    {
      accessorKey: 'sent_at',
      header: 'Отправлен',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
        ) : (
          dayjs(row.original.sent_at).format('DD.MM.YYYY')
        ),
    },
    {
      accessorKey: 'delivered_at',
      header: 'Доставлен',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
        ) : row.original.delivered_at ? (
          dayjs(row.original.delivered_at).format('DD.MM.YYYY')
        ) : (
          'Не доставлен'
        ),
    },
    {
      accessorKey: 'price',
      header: 'Стоимость',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-4 w-16 bg-muted rounded-md animate-pulse" />
        ) : (
          `${ row.original.price } сом`
        ),
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => {
        if (row.original.isSkeleton) {
          return <div className="h-8 w-20 bg-muted rounded-md animate-pulse" />
        }

        const status = row.original.status
        const arrivalStatusStyles = {
          'в сборке': 'bg-yellow-100 text-yellow-600 rounded-lg font-bold px-4 py-2',
          'доставлен': 'bg-emerald-100 text-emerald-700 rounded-lg font-bold px-4 py-2',
          'в пути': 'bg-indigo-100 text-indigo-700 rounded-lg font-bold px-4 py-2',
        }

        return <StatusBadge status={status} stylesMap={arrivalStatusStyles} />
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      enableGlobalFilter: false,
      enableHiding: false,
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-8 w-10 bg-muted rounded-md animate-pulse" />
        ) : (
          <TableArchivedActionsMenu<OrderWithClient>
            row={row.original}
            onDelete={id => handleConfirmationOpen(id, 'delete')}
            onRestore={id => handleConfirmationOpen(id, 'unarchive')}
          />
        ),
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={loading ? skeletonRows : orders ?? []} />

      <ConfirmationModal
        open={confirmationOpen}
        entityName="этот заказ"
        actionType={actionType}
        onConfirm={handleConfirmationAction}
        onCancel={handleConfirmationClose}
      />
    </div>
  )
}

export default ArchivedOrders
