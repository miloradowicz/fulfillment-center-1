import { ColumnDef } from '@tanstack/react-table'
import { Invoice } from '@/types'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'
import useArchivedInvoiceActions from '@/features/archive/hooks/useArchivedInvoiceActions.ts'
import { StatusBadge } from '@/components/StatusBadge/StatusBadge.tsx'
import { NumberBadge } from '@/components/NumberBadge/NumberBadge.tsx'

const ArchivedInvoices = () => {
  const {
    invoices,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  } = useArchivedInvoiceActions()

  const columns: ColumnDef<Invoice>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: 'invoiceNumber',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Номер счета" />,
      cell: ({ row }) => {
        return <NumberBadge number={row.original.invoiceNumber} />
      },
      enableHiding: false,
    },
    {
      accessorKey: 'client.name',
      header: 'Клиент',
      cell: ({ row }) => row.original.client?.name,
    },
    {
      accessorKey: 'totalAmount',
      header: 'Общая сумма',
      cell: ({ row }) => `${ row.original.totalAmount } сом`,
    },
    {
      accessorKey: 'status',
      header: 'Статус оплаты',
      cell: ({ row }) => {
        const status = row.original.status
        const arrivalStatusStyles = {
          'в ожидании': 'bg-yellow-100 text-yellow-600 rounded-lg font-bold px-4 py-2',
          'оплачено': 'bg-emerald-100 text-emerald-700 rounded-lg font-bold px-4 py-2',
          'частично оплачено': 'bg-indigo-100 text-indigo-700 rounded-lg font-bold px-4 py-2',
        }

        return <StatusBadge status={status ?? '—'} stylesMap={arrivalStatusStyles}/>
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      enableGlobalFilter: false,
      enableHiding: false,
      cell: ({ row }) => {
        const tableInvoice = row.original

        return (
          <TableArchivedActionsMenu<Invoice>
            row={tableInvoice}
            onDelete={id => handleConfirmationOpen(id, 'delete')}
            onRestore={id => handleConfirmationOpen(id, 'unarchive')}
          />
        )
      },
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={invoices ?? []}/>

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

export default ArchivedInvoices
