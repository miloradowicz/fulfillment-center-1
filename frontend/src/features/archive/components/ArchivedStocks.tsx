import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import useArchivedStocksActions from '../hooks/useArchivedStocksActions.ts'
import { Stock } from '@/types'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'
import { ColumnDef } from '@tanstack/react-table'
import { useSkeletonTableRows } from '@/features/archive/hooks/useTableSkeleton.ts'

const ArchivedStocks = () => {
  const {
    stocks,
    loading,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  } = useArchivedStocksActions()

  const skeletonRows = useSkeletonTableRows<Stock>(
    {
      _id: '',
      name: '',
      address: '',
    },
    stocks?.length || 3,
  )

  const columns: ColumnDef<Stock & { isSkeleton?: boolean }>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Название" />,
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-6 w-40 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.name ?? 'Неизвестное название'
        ),
      enableHiding: false,
    },
    {
      accessorKey: 'address',
      header: 'Адрес',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-6 w-60 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.address ?? 'Неизвестный адрес'
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
          <TableArchivedActionsMenu<Stock>
            row={row.original}
            onDelete={id => handleConfirmationOpen(id, 'delete')}
            onRestore={id => handleConfirmationOpen(id, 'unarchive')}
          />
        ),
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={loading ? skeletonRows : stocks ?? []} />

      <ConfirmationModal
        open={confirmationOpen}
        entityName="этот склад"
        actionType={actionType}
        onConfirm={handleConfirmationAction}
        onCancel={handleConfirmationClose}
      />
    </div>
  )
}

export default ArchivedStocks
