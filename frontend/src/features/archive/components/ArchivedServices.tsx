import { ColumnDef } from '@tanstack/react-table'
import { PopulatedService } from '@/types'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import useArchivedServicesActions from '@/features/archive/hooks/useArchivedServicesActions.ts'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'
import { Loader2 } from 'lucide-react'

const ArchivedServices = () => {
  const {
    services,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
    loading,
  } = useArchivedServicesActions()

  const columns: ColumnDef<PopulatedService>[] = [
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
      accessorKey: 'serviceCategory.name',
      header: 'Категория',
      cell: ({ row }) => <div>{row.original.serviceCategory.name}</div>,
    },
    {
      accessorKey: 'price',
      header: 'Цена',
      cell: ({ row }) => <div>{row.original.price}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Тип',
      cell: ({ row }) => <div>{row.original.type}</div>,
    },
    {
      id: 'actions',
      header: 'Действия',
      enableGlobalFilter: false,
      enableHiding: false,
      cell: ({ row }) => {
        const tableService = row.original

        return (
          <TableArchivedActionsMenu<PopulatedService>
            row={tableService}
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
        </div> :<><DataTable columns={columns} data={services ?? []}/></>}


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

export default ArchivedServices
