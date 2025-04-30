import dayjs from 'dayjs'
import { useArchivedArrivalsActions } from '../hooks/useArchivedArrivalsActions.ts'
import { ArrivalWithClient } from '@/types'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { ColumnDef } from '@tanstack/react-table'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'


const ArchivedArrivals = () => {
  const { arrivals,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction } = useArchivedArrivalsActions()

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
        const arrival = row.original
        return (
          <div
            className="inline-block text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 transition-colors px-3 py-1.5 rounded-lg shadow-sm"
          >
            {arrival.arrivalNumber}
          </div>
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
      cell: ({ row }) => {
        const status = row.original.arrival_status

        const statusStyles: Record<'ожидается доставка' | 'получена' | 'отсортирована', string> = {
          'ожидается доставка':
            'bg-yellow-100 text-yellow-600 rounded-lg font-bold px-4 py-2',
          'получена':
            'bg-emerald-100 text-emerald-700 transition-colors rounded-lg font-bold px-4 py-2',
          'отсортирована':
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
        const tableArrival = row.original

        return (
          <TableArchivedActionsMenu<ArrivalWithClient>
            row={tableArrival}
            onDelete={id => handleConfirmationOpen(id, 'delete')}
            onRestore={id => handleConfirmationOpen(id, 'unarchive')}
          />
        )
      },
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">


      <> <DataTable columns={columns} data={arrivals ?? []}/>

      </>


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

export default ArchivedArrivals
