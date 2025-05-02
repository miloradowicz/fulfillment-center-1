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
import { useSkeletonTableRows } from '@/features/archive/hooks/useTableSkeleton.ts'

const ArchivedInvoices = () => {
  const {
    invoices,
    loading,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  } = useArchivedInvoiceActions()

  const skeletonRows = useSkeletonTableRows<Invoice>(
    {
      _id: '',
      invoiceNumber: '',
      client: { name: '', _id: '', inn: '', address: '', ogrn: '', email: '', phone_number: '' },
      totalAmount: 0,
      status: undefined,
    },
    invoices?.length || 3,
  )

  const columns: ColumnDef<Invoice & { isSkeleton?: boolean }>[] = [
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
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-6 w-20 bg-muted rounded-md animate-pulse" />
        ) : (
          <NumberBadge number={row.original.invoiceNumber} />
        ),
      enableHiding: false,
    },
    {
      accessorKey: 'client.name',
      header: 'Клиент',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-4 w-36 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.client?.name
        ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Общая сумма',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-4 w-24 bg-muted rounded-md animate-pulse" />
        ) : (
          `${ row.original.totalAmount } сом`
        ),
    },
    {
      accessorKey: 'status',
      header: 'Статус оплаты',
      cell: ({ row }) => {
        if (row.original.isSkeleton) {
          return <div className="h-8 w-28 bg-muted rounded-md animate-pulse" />
        }

        const status = row.original.status
        const arrivalStatusStyles = {
          'в ожидании': 'bg-yellow-100 text-yellow-600 rounded-lg font-bold px-4 py-2',
          'оплачено': 'bg-emerald-100 text-emerald-700 rounded-lg font-bold px-4 py-2',
          'частично оплачено': 'bg-indigo-100 text-indigo-700 rounded-lg font-bold px-4 py-2',
        }

        return <StatusBadge status={status ?? '—'} stylesMap={arrivalStatusStyles} />
      },
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
          <TableArchivedActionsMenu<Invoice>
            row={row.original}
            onDelete={id => handleConfirmationOpen(id, 'delete')}
            onRestore={id => handleConfirmationOpen(id, 'unarchive')}
          />
        ),
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={loading ? skeletonRows : invoices ?? []} />

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
