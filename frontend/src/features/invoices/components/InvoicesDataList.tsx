import React from 'react'
import { useInvoicesList } from '../hooks/useInvoicesList'
import { Invoice } from '@/types'
import { NavLink } from 'react-router-dom'
import DataTable from '@/components/DataTable/DataTable'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader'
import TableActionsMenu from '@/components/DataTable/TableActionsMenu/TableActionsMenu'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn'
import ConfirmationModal from '@/components/Modal/ConfirmationModal'
// import Modal from '@/components/Modal/Modal'
// import InvoiceForm from './InvoiceForm'
import { ColumnDef } from '@tanstack/react-table'

interface Props {
  onEdit: (data: Invoice) => void
}

const InvoicesDataList: React.FC<Props> = ({ onEdit }) => {
  const {
    invoices,
    handleArchiveClick,
    handleConfirmArchive,
    handleClose,
    // isOpen,
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

      {/*<div className="my-8">*/}
      {/*/!*  <Modal handleClose={handleClose} open={isOpen}>*!/  <--- подключить, когда будет готова форма*/}
      {/*    <InvoiceForm />*/}
      {/*  </Modal>*/}
      {/*</div>*/}
    </div>
  )
}

export default InvoicesDataList
