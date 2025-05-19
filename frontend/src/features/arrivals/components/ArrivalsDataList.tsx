import React from 'react'
import { useArrivalsList } from '../hooks/useArrivalsList.ts'
import { ArrivalWithClient } from '@/types'
import { NavLink } from 'react-router-dom'
import dayjs from 'dayjs'
import Modal from '@/components/Modal/Modal.tsx'
import ArrivalForm from './ArrivalForm.tsx'
import StatusArrivalCell from './StatusArrivalCell.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { ColumnDef } from '@tanstack/react-table'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableActionsMenu from '@/components/DataTable/TableActionsMenu/TableActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'

interface Props {
  onEdit: (data: ArrivalWithClient) => void
}

const ArrivalsDataList: React.FC<Props> = ({ onEdit }) => {
  const { arrivals, handleArchiveClick, handleConfirmArchive, handleClose, isOpen, archiveModalOpen, handleCancelConfirm,
    handleCancelCancel, openCancelModal,  setArrivalToCancel, setOpenCancelModal } = useArrivalsList()

  const columns: ColumnDef<ArrivalWithClient>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'arrivalNumber',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Номер поставки" />,
      cell: ({ row }) => {
        const tableArrival = row.original

        return (
          <NavLink
            to={`/arrivals/${ tableArrival._id }`}
            className="inline-block text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:text-blue-800 transition-colors px-3 py-1.5 rounded-lg shadow-sm"
          >
            {tableArrival.arrivalNumber}
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
      accessorKey: 'arrival_date',
      header: 'Дата поставки',
      cell: ({ row }) => dayjs(row.original.arrival_date).format('DD.MM.YYYY'),
    },
    {
      accessorKey: 'arrival_status',
      header: 'Статус',
      cell: ({ row }) => <StatusArrivalCell row={row.original} />,
    },
    {
      id: 'actions',
      header: 'Действия',
      enableGlobalFilter: false,
      enableHiding: false,
      cell: ({ row }) => {
        const tableArrival = row.original

        return (
          <TableActionsMenu<ArrivalWithClient>
            row={tableArrival}
            handleOpen={() => onEdit(tableArrival)}
            handleConfirmationOpen={() => handleArchiveClick(tableArrival._id)}
            showDetailsLink={true}
            detailsPathPrefix="arrivals"
            handleCancel={() => {
              setArrivalToCancel(tableArrival)
              setOpenCancelModal(true)
            }}
          />
        )
      },
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={arrivals ?? []} />

      <ConfirmationModal
        open={archiveModalOpen}
        entityName="эту поставку"
        actionType="archive"
        onConfirm={handleConfirmArchive}
        onCancel={handleClose}
      />
      <ConfirmationModal
        open={openCancelModal}
        entityName="эту поставку"
        actionType="cancel"
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelCancel}
      />

      <div className="my-8">
        <Modal handleClose={handleClose} open={isOpen}>
          <ArrivalForm />
        </Modal>
      </div>
    </div>
  )
}

export default ArrivalsDataList
