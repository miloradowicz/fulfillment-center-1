import { Counterparty } from '@/types'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { useArchivedCounterpartiesActions } from '../hooks/useArchivedCounterpartiesActions.ts'
import { ColumnDef } from '@tanstack/react-table'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'
import { useSkeletonTableRows } from '@/features/archive/hooks/useTableSkeleton.ts'

const ArchivedCounterparties = () => {
  const {
    counterparties,
    loading,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  } = useArchivedCounterpartiesActions(true)

  const skeletonRows = useSkeletonTableRows<Counterparty>(
    {
      _id: '',
      name: '',
      phone_number: '',
      address: '',
    },
    counterparties?.length || 3,
  )

  const columns: ColumnDef<Counterparty & { isSkeleton?: boolean }>[] = [
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
      enableColumnFilter: true,
      enableHiding: false,
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-8 w-40 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.name
        ),
    },
    {
      accessorKey: 'phone_number',
      header: 'Телефон',
      enableColumnFilter: true,
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-6 w-28 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.phone_number
        ),
    },
    {
      accessorKey: 'address',
      header: 'Адрес',
      enableColumnFilter: true,
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-6 w-48 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.address || '—'
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
          <TableArchivedActionsMenu<Counterparty>
            row={row.original}
            onDelete={id => handleConfirmationOpen(id, 'delete')}
            onRestore={id => handleConfirmationOpen(id, 'unarchive')}
          />
        ),
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={loading ? skeletonRows : counterparties ?? []} />
      <ConfirmationModal
        open={confirmationOpen}
        entityName="этого контрагента"
        actionType={actionType}
        onConfirm={handleConfirmationAction}
        onCancel={handleConfirmationClose}
      />
    </div>
  )
}

export default ArchivedCounterparties
