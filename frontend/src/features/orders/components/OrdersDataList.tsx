import { OrderWithClient } from '@/types'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import dayjs from 'dayjs'
import StatusOrderCell from './StatusOrderCell.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { ColumnDef } from '@tanstack/react-table'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableActionsMenu from '@/components/DataTable/TableActionsMenu/TableActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'

interface Props {
  orders: OrderWithClient[] | []
  handleDelete: (id: string) => void
  onEdit: (data: OrderWithClient) => void
  handleCancelOrder: (id: string) => void
}

const OrdersDataList: React.FC<Props> = ({ orders, handleDelete, onEdit, handleCancelOrder }) => {
  const [openModal, setOpenModal] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<OrderWithClient | null>(null)
  const [orderToCancel, setOrderToCancel] = useState<OrderWithClient | null>(null)
  const [openCancelModal, setOpenCancelModal] = useState(false)

  const columns: ColumnDef<OrderWithClient>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'orderNumber',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Номер заказа" />,
      cell: ({ row }) => {
        const tableOrder = row.original

        return (
          <NavLink
            to={`/orders/${ tableOrder._id }`}
            className="inline-block text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:text-blue-800 transition-colors px-3 py-1.5 rounded-lg shadow-sm"
          >
            {tableOrder.orderNumber}
          </NavLink>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: 'client.name',
      header: 'Клиент',
      cell: ({ row }) => row.original.client?.name ?? 'Неизвестный клиент',
    },
    {
      accessorKey: 'stock.name',
      header: 'Склад',
      cell: ({ row }) => row.original.stock?.name ?? 'Неизвестный склад',
    },
    {
      accessorKey: 'sent_at',
      header: 'Отправлен',
      cell: ({ row }) => dayjs(row.original.sent_at).format('DD.MM.YYYY'),
    },
    {
      accessorKey: 'delivered_at',
      header: 'Доставлен',
      cell: ({ row }) =>
        row.original.delivered_at ? dayjs(row.original.delivered_at).format('DD.MM.YYYY') : 'Не доставлен',
    },
    {
      accessorKey: 'price',
      header: 'Стоимость',
      cell: ({ row }) => row.original.price,
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => <StatusOrderCell row={row.original} />,
    },
    {
      id: 'actions',
      header: 'Действия',
      enableGlobalFilter: false,
      enableHiding: false,
      cell: ({ row }) => {
        const tableOrder = row.original

        return (
          <TableActionsMenu<OrderWithClient>
            row={tableOrder}
            handleOpen={() => onEdit(tableOrder)}
            handleConfirmationOpen={() => {
              setOrderToDelete(tableOrder)
              setOpenModal(true)
            }}
            showDetailsLink={true}
            detailsPathPrefix="orders"
            handleCancel={() => {
              setOrderToCancel(tableOrder)
              setOpenCancelModal(true)
            }}
          />
        )
      },
    },
  ]

  const handleModalConfirm = () => {
    if (orderToDelete) {
      handleDelete(orderToDelete._id)
    }
    setOpenModal(false)
  }

  const handleModalCancel = () => {
    setOpenModal(false)
    setOrderToDelete(null)
  }

  const handleCancelConfirm = async () => {
    if (orderToCancel) {
      handleCancelOrder(orderToCancel._id)
    }
    setOpenCancelModal(false)
    setOrderToCancel(null)
  }
  const handleCancelCancel = () => {
    setOpenCancelModal(false)
    setOrderToCancel(null)
  }

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={orders ?? []} />

      <ConfirmationModal
        open={openModal}
        entityName="этот заказ"
        actionType="archive"
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
      <ConfirmationModal
        open={openCancelModal}
        entityName="этот заказ"
        actionType="cancel"
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelCancel}
      />
    </div>
  )
}

export default OrdersDataList
