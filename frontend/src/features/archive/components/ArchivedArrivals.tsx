import dayjs from 'dayjs'
import { useArchivedArrivalsActions } from '../hooks/useArchivedArrivalsActions.ts'
import { ArrivalWithClient } from '@/types'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { ColumnDef } from '@tanstack/react-table'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'
import { StatusBadge } from '@/components/StatusBadge/StatusBadge.tsx'
import { NumberBadge } from '@/components/NumberBadge/NumberBadge.tsx'
import { useSkeletonTableRows } from '@/features/archive/hooks/useTableSkeleton.ts'

const ArchivedArrivals = () => {
  const {
    arrivals,
    loading,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  } = useArchivedArrivalsActions()

  const skeletonRows = useSkeletonTableRows<ArrivalWithClient>(
    {
      arrivalNumber: '',
      client: { name: '', _id: '', inn: '', address: '', ogrn: '', email: '', phone_number: '' },
      stock: { name: '', _id: '', address: '' },
      arrival_date: '',
      arrival_status: '',
      documents: [],
      products: [],
    },
    arrivals ? arrivals.length : 3,
  )

  const arrivalStatusStyles = {
    'ожидается доставка': 'bg-yellow-100 text-yellow-600 rounded-lg font-bold px-4 py-2',
    'получена': 'bg-emerald-100 text-emerald-700 rounded-lg font-bold px-4 py-2',
    'отсортирована': 'bg-indigo-100 text-indigo-700 rounded-lg font-bold px-4 py-2',
  }

  const columns: ColumnDef<ArrivalWithClient & { isSkeleton?: boolean }>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'arrivalNumber',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Номер поставки" />,
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-10 w-20 bg-muted rounded-md animate-pulse" />
        ) : (
          <NumberBadge number={row.original.arrivalNumber} />
        ),
      enableHiding: false,
    },
    {
      accessorKey: 'client.name',
      header: 'Клиент',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-8 w-20 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.client?.name ?? 'Неизвестный клиент'
        ),
    },
    {
      accessorKey: 'stock.name',
      header: 'Склад',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-6 w-30 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.stock?.name ?? 'Неизвестный склад'
        ),
    },
    {
      accessorKey: 'arrival_date',
      header: 'Дата поставки',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-6 w-24 bg-muted rounded-md animate-pulse" />
        ) : (
          dayjs(row.original.arrival_date).format('DD.MM.YYYY')
        ),
    },
    {
      accessorKey: 'arrival_status',
      header: 'Статус',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
        ) : (
          <StatusBadge status={row.original.arrival_status} stylesMap={arrivalStatusStyles} />
        ),
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
          <TableArchivedActionsMenu<ArrivalWithClient>
            row={row.original}
            onDelete={id => handleConfirmationOpen(id, 'delete')}
            onRestore={id => handleConfirmationOpen(id, 'unarchive')}
          />
        ),
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={loading ? skeletonRows : arrivals ?? []} />
      <ConfirmationModal
        open={confirmationOpen}
        entityName="эту поставку"
        actionType={actionType}
        onConfirm={handleConfirmationAction}
        onCancel={handleConfirmationClose}
      />
    </div>
  )
}

export default ArchivedArrivals
