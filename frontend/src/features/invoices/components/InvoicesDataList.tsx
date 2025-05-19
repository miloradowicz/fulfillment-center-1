import React from 'react'
import { useInvoicesList } from '../hooks/useInvoicesList'
import { Invoice } from '@/types'
import { NavLink } from 'react-router-dom'
import DataTable from '@/components/DataTable/DataTable'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader'
import TableActionsMenu from '@/components/DataTable/TableActionsMenu/TableActionsMenu'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn'
import ConfirmationModal from '@/components/Modal/ConfirmationModal'
import { ColumnDef } from '@tanstack/react-table'
import { invoiceStatusStyles } from '@/utils/commonStyles.ts'
import { formatMoney } from '@/utils/formatMoney.ts'

interface Props {
  onEdit: (data: Invoice) => void
}

const InvoicesDataList: React.FC<Props> = ({ onEdit }) => {
  const {
    invoices,
    handleArchiveClick,
    handleConfirmArchive,
    handleClose,
    archiveModalOpen,
  } = useInvoicesList()

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
      enableHiding: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Номер счета" />,
      cell: ({ row }) => {
        const invoice = row.original
        return (
          <NavLink
            to={`/invoices/${ invoice._id }`}
            className="inline-block text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:text-blue-800 transition-colors px-3 py-1.5 rounded-lg shadow-sm"
          >
            {invoice.invoiceNumber}
          </NavLink>
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
      cell: ({ row }) => `${ formatMoney(row.original.totalAmount) } ₽`    },
    {
      accessorKey: 'status',
      header: 'Статус оплаты',
      cell: ({ row }) => {
        const status = row.original.status

        const capitalizeFirstLetter = (str: string) => {
          return str.charAt(0).toUpperCase() + str.slice(1)
        }

        const statusClass = invoiceStatusStyles[status as keyof typeof invoiceStatusStyles] || 'bg-primary/10 text-primary/80 border font-bold px-4 py-2'

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
        const invoice = row.original
        return (
          <TableActionsMenu<Invoice>
            row={invoice}
            handleOpen={() => onEdit(invoice)}
            handleConfirmationOpen={() => handleArchiveClick(invoice._id)}
            showDetailsLink={true}
            detailsPathPrefix="invoices"
          />
        )
      },
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={invoices ?? []} />

      <ConfirmationModal
        open={archiveModalOpen}
        entityName="этот счёт"
        actionType="archive"
        onConfirm={handleConfirmArchive}
        onCancel={handleClose}
      />
    </div>
  )
}

export default InvoicesDataList
