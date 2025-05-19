import { Counterparty } from '@/types'
import { useCounterpartiesList } from '../hooks/useCounterpartiesList.ts'
import CounterpartyForm from './CounterpartyForm.tsx'
import Modal from '@/components/Modal/Modal.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { useState } from 'react'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import { ColumnDef } from '@tanstack/react-table'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableActionsMenu from '@/components/DataTable/TableActionsMenu/TableActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'

const CounterpartiesDataList = () => {
  const {
    counterparties,
    confirmationModalOpen,
    handleOpenConfirmationModal,
    handleCloseConfirmationModal,
    confirmArchive,
  } = useCounterpartiesList()

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedCounterparty, setSelectedCounterparty] = useState<Counterparty | null>(null)

  const handleOpenEditModal = (counterparty: Counterparty) => {
    setSelectedCounterparty(counterparty)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedCounterparty(null)
  }
  const columns: ColumnDef<Counterparty>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Название" />,
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
        const tableCounterparty = row.original

        return (
          <TableActionsMenu<Counterparty>
            row={tableCounterparty}
            handleOpen={handleOpenEditModal}
            handleConfirmationOpen={() => handleOpenConfirmationModal(tableCounterparty)}
            showDetailsLink={false}
          />
        )
      },
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={counterparties ?? []} />

      <Modal open={editModalOpen} handleClose={handleCloseEditModal}>
        {selectedCounterparty && (
          <CounterpartyForm counterparty={selectedCounterparty} onClose={handleCloseEditModal} />
        )}
      </Modal>

      <ConfirmationModal
        open={confirmationModalOpen}
        entityName="этого контрагента"
        actionType="archive"
        onConfirm={confirmArchive}
        onCancel={handleCloseConfirmationModal}
      />
    </div>
  )
}

export default CounterpartiesDataList
