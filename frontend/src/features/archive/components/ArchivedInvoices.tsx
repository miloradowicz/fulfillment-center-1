import { ColumnDef } from '@tanstack/react-table'
import { Invoice } from '@/types'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'
import useArchivedInvoiceActions from '@/features/archive/hooks/useArchivedInvoiceActions.ts'
import { Loader2 } from 'lucide-react'

const ArchivedInvoices = () => {
  const {
    invoices,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
    loading,
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
        const invoice = row.original
        return (
          <div
            className="inline-block text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:text-blue-800 transition-colors px-3 py-1.5 rounded-lg shadow-sm"
          >
            {invoice.invoiceNumber}
          </div>
        )
      },
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

        const statusStyles: Record<'в ожидании' | 'оплачено' | 'частично оплачено', string> = {
          'в ожидании':
            'bg-yellow-100 text-yellow-600 rounded-lg font-bold px-4 py-2',
          'оплачено':
            'bg-emerald-100 text-emerald-700 transition-colors rounded-lg font-bold px-4 py-2',
          'частично оплачено':
            'bg-indigo-100 text-indigo-700 rounded-lg font-bold px-4 py-2',
        }

        const capitalizeFirstLetter = (str: string) => {
          return str.charAt(0).toUpperCase() + str.slice(1)
        }

        const statusClass = statusStyles[status as keyof typeof statusStyles] || 'bg-primary/10 text-primary/80 border font-bold px-4 py-2'

        return (
          <span className={statusClass}>
            {capitalizeFirstLetter(status as string)}
          </span>
        )
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
      {loading?
        <div className="flex justify-center items-center my-10">
          <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
        </div> :<> <DataTable columns={columns} data={invoices ?? []}/></>}

      <ConfirmationModal
        open={confirmationOpen}
        entityName="эту услугу"
        actionType={actionType}
        onConfirm={handleConfirmationAction}
        onCancel={handleConfirmationClose}
      />
    </div>
  )
}

export default ArchivedInvoices
