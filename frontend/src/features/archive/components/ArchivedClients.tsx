import { Client } from '@/types'
import { useArchivedClientActions } from '../hooks/useArchivedClientActions.ts'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { ColumnDef } from '@tanstack/react-table'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'

const ArchivedClients = () => {
  const {
    clients,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  } = useArchivedClientActions()

  const columns: ColumnDef<Client>[] = [
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
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'phone_number',
      header: 'Телефон',
      enableColumnFilter: true,
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableColumnFilter: true,
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'inn',
      header: 'ИНН',
      enableColumnFilter: true,
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'address',
      header: 'Адрес',
      enableColumnFilter: true,
      cell: info => info.getValue() || '—',
    },
    {
      id: 'actions',
      header: 'Действия',
      enableGlobalFilter: false,
      enableHiding: false,
      cell: ({ row }) => {
        const tableClient = row.original

        return (
          <TableArchivedActionsMenu<Client>
            row={tableClient}
            onDelete={id => handleConfirmationOpen(id, 'delete')}
            onRestore={id => handleConfirmationOpen(id, 'unarchive')}
          />
        )
      },
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={clients ?? []}/>

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
