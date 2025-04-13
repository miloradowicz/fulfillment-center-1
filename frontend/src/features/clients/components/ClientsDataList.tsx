import { Client } from '@/types'
import { useClientActions } from '../hooks/useClientActions.ts'
import ClientForm from './ClientForm.tsx'
import Modal from '@/components/Modal/Modal.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/components/DataTable/DataTable.tsx'
import TableActionsMenu from '@/components/DataTable/TableActionsMenu/TableActionsMenu.tsx'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'

const ClientsDataList = () => {
  const {
    clients,
    selectedClient,
    open,
    handleOpen,
    handleClose,
    confirmationOpen,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationDelete,
  } = useClientActions(true)

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
          <TableActionsMenu<Client>
            row={tableClient}
            handleOpen={handleOpen}
            handleConfirmationOpen={handleConfirmationOpen}
            showDetailsLink={true}
            detailsPathPrefix="clients"
          />
        )
      },
    },
  ]

  return (
    <div className="max-w-[1000px] w-full mx-auto space-y-4">
      <DataTable columns={columns} data={clients ?? []} />

      <ConfirmationModal
        open={confirmationOpen}
        entityName="этого клиента"
        actionType="delete"
        onConfirm={handleConfirmationDelete}
        onCancel={handleConfirmationClose}
      />

      <Modal open={open} handleClose={handleClose}>
        <ClientForm client={selectedClient} onClose={handleClose} />
      </Modal>
    </div>
  )
}

export default ClientsDataList
