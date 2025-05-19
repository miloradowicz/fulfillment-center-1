import { ColumnDef } from '@tanstack/react-table'
import { PopulatedService } from '@/types'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import useArchivedServicesActions from '@/features/archive/hooks/useArchivedServicesActions.ts'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'
import { useSkeletonTableRows } from '@/features/archive/hooks/useTableSkeleton.ts'

const ArchivedServices = () => {
  const {
    services,
    loading,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  } = useArchivedServicesActions()

  const skeletonRows = useSkeletonTableRows<PopulatedService>(
    {
      _id: '',
      name: '',
      serviceCategory: { _id:'', name: '' },
      price: 0,
      type: undefined,
    },
    services?.length || 3,
  )

  const columns: ColumnDef<PopulatedService & { isSkeleton?: boolean }>[] = [
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
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-4 w-40 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.name ?? 'Неизвестное имя'
        ),
      enableHiding: false,
    },
    {
      accessorKey: 'serviceCategory.name',
      header: 'Категория',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-4 w-40 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.serviceCategory?.name ?? 'Неизвестная категория'
        ),
    },
    {
      accessorKey: 'price',
      header: 'Цена',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.price ?? 'Неизвестная цена'
        ),
    },
    {
      accessorKey: 'type',
      header: 'Тип',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.type ?? 'Неизвестный тип'
        ),
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
          <TableArchivedActionsMenu<PopulatedService>
            row={row.original}
            onDelete={id => handleConfirmationOpen(id, 'delete')}
            onRestore={id => handleConfirmationOpen(id, 'unarchive')}
          />
        ),
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={loading ? skeletonRows : services ?? []} />

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
