import { Client } from '@/types'
import { useArchivedClientActions } from '../hooks/useArchivedClientActions.ts'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { ColumnDef } from '@tanstack/react-table'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'
import { useSkeletonTableRows } from '@/features/archive/hooks/useTableSkeleton.ts'

const ArchivedClients = () => {
  const {
    clients,
    loading,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  } = useArchivedClientActions()

  const skeletonRows = useSkeletonTableRows<Client>(
    {
      _id: '',
      name: '',
      email: '',
      phone_number: '',
      inn: '',
      ogrn: '',
      address: '',
    },
    clients?.length || 3,
  )

  const columns: ColumnDef<Client & { isSkeleton?: boolean }>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Имя" />,
      enableColumnFilter: true,
      enableHiding: false,
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-8 w-50 bg-muted rounded-md animate-pulse" />
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
          <div className="h-6 w-15 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.phone_number
        ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableColumnFilter: true,
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-6 w-15 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.email
        ),
    },
    {
      accessorKey: 'inn',
      header: 'ИНН',
      enableColumnFilter: true,
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-6 w-20 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.inn
        ),
    },
    {
      accessorKey: 'address',
      header: 'Адрес',
      enableColumnFilter: true,
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-6 w-28 bg-muted rounded-md animate-pulse" />
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
          <TableArchivedActionsMenu<Client>
            row={row.original}
            onDelete={id => handleConfirmationOpen(id, 'delete')}
            onRestore={id => handleConfirmationOpen(id, 'unarchive')}
          />
        ),
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={loading ? skeletonRows : clients ?? []} />
      <ConfirmationModal
        open={confirmationOpen}
        entityName="этого клиента"
        actionType={actionType}
        onConfirm={handleConfirmationAction}
        onCancel={handleConfirmationClose}
      />
    </div>
  )
}

export default ArchivedClients
