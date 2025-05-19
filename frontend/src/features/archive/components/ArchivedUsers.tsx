import { ColumnDef } from '@tanstack/react-table'
import { UserWithPopulate } from '@/types'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import useArchivedUsersActions from '@/features/archive/hooks/useArchivedUsersActions.ts'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import { useSkeletonTableRows } from '@/features/archive/hooks/useTableSkeleton.ts'

const ArchivedUsers = () => {
  const {
    users,
    loading,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  } = useArchivedUsersActions()

  const skeletonRows = useSkeletonTableRows<UserWithPopulate>(
    {
      _id: '',
      displayName: '',
      email: '',
      role: undefined,
    },
    users?.length || 5,
  )

  const columns: ColumnDef<UserWithPopulate & { isSkeleton?: boolean }>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'displayName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Отображаемое имя" />,
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
        ) : (
          <div className="font-medium">{row.original.displayName}</div>
        ),
      enableHiding: false,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-6 w-64 bg-muted rounded-md animate-pulse" />
        ) : (
          <div>{row.original.email}</div>
        ),
    },
    {
      accessorKey: 'role',
      header: 'Роль',
      cell: ({ row }) => {
        if (row.original.isSkeleton) {
          return <div className="h-6 w-28 bg-muted rounded-md animate-pulse" />
        }

        const role = row.original.role
        const variant =
          role === 'super-admin'
            ? 'destructive'
            : role === 'admin'
              ? 'default'
              : 'secondary'

        return (
          <Badge variant={variant}>
            {role === 'super-admin' && 'Супер-админ'}
            {role === 'admin' && 'Администратор'}
            {role === 'manager' && 'Менеджер'}
            {role === 'stock-worker' && 'Работник склада'}
          </Badge>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
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
          <TableArchivedActionsMenu<UserWithPopulate>
            row={row.original}
            onDelete={id => handleConfirmationOpen(id, 'delete')}
            onRestore={id => handleConfirmationOpen(id, 'unarchive')}
          />
        ),
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={loading ? skeletonRows : users ?? []} />

      <ConfirmationModal
        open={confirmationOpen}
        entityName="этого пользователя"
        actionType={actionType}
        onConfirm={handleConfirmationAction}
        onCancel={handleConfirmationClose}
      />
    </div>
  )
}

export default ArchivedUsers
