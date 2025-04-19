import { UserWithPopulate } from '@/types'
import useUserActions from '../hooks/useUserActions'
import Modal from '@/components/Modal/Modal'
import RegistrationForm from '../../users/components/RegistrationForm.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal'
import { ColumnDef } from '@tanstack/react-table'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader'
import TableActionsMenu from '@/components/DataTable/TableActionsMenu/TableActionsMenu'
import DataTable from '@/components/DataTable/DataTable'
import { Badge } from '@/components/ui/badge'

const UsersDataList = () => {
  const {
    users,
    open,
    confirmationOpen,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationArchive,
    handleClose,
    handleOpen,
    fetchAllUsers,
  } = useUserActions(true)

  const columns: ColumnDef<UserWithPopulate>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'displayName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Отображаемое имя" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.displayName}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <div>{row.original.email}</div>,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Роль" />
      ),
      cell: ({ row }) => {
        const role = row.original.role
        const variant = role === 'super-admin' ? 'destructive' :
          role === 'admin' ? 'default' : 'secondary'
        return (
          <Badge variant={variant}>
            {role === 'super-admin' && 'Супер-админ'}
            {role === 'admin' && 'Администратор'}
            {role === 'manager' && 'Мэнеджер'}
            {role === 'stock-worker' && 'Работник склада'}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      enableGlobalFilter: false,
      enableHiding: false,
      cell: ({ row }) => {
        const tableUser = row.original

        return (
          <TableActionsMenu<UserWithPopulate>
            row={tableUser}
            handleOpen={handleOpen}
            handleConfirmationOpen={handleConfirmationOpen}
            showDetailsLink={true}
            detailsPathPrefix="users"
          />
        )
      },
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={users ?? []} />

      <Modal handleClose={handleClose} open={open}>
        <RegistrationForm
          onSuccess={() => {
            void fetchAllUsers()
            handleClose()
          }}
        />
      </Modal>

      <ConfirmationModal
        open={confirmationOpen}
        entityName="этого пользователя"
        actionType={'archive'}
        onConfirm={handleConfirmationArchive}
        onCancel={handleConfirmationClose}
      />
    </div>
  )
}

export default UsersDataList
