import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { ProductWithPopulate } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'

import { useSkeletonTableRows } from '@/features/archive/hooks/useTableSkeleton.ts'
import useArchivedProductActions from '@/features/archive/hooks/useArchivedProductsActions.ts'

const ArchivedProducts = () => {
  const {
    products,
    loading,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  } = useArchivedProductActions()

  const skeletonRows = useSkeletonTableRows<ProductWithPopulate>(
    {
      _id: '',
      title: '',
      article: '',
      barcode: '',
      client: { name: '', _id: '', inn: '', address: '', ogrn: '', email: '', phone_number: '' },
    },
    products? products.length: 3,
  )

  const columns: ColumnDef<ProductWithPopulate & { isSkeleton?: boolean }>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Название" />,
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-4 w-40 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.title ?? 'Неизвестное название'
        ),
      enableHiding: false,
    },
    {
      accessorKey: 'article',
      header: 'Артикул',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.article ?? 'Неизвестный артикул'
        ),
    },
    {
      accessorKey: 'barcode',
      header: 'Баркод',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.barcode ?? 'Неизвестный баркод'
        ),
    },
    {
      accessorKey: 'client.name',
      header: 'Клиент',
      cell: ({ row }) =>
        row.original.isSkeleton ? (
          <div className="h-4 w-26 bg-muted rounded-md animate-pulse" />
        ) : (
          row.original.client?.name ?? 'Неизвестный клиент'
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
          <TableArchivedActionsMenu<ProductWithPopulate>
            row={row.original}
            onDelete={id => handleConfirmationOpen(id, 'delete')}
            onRestore={id => handleConfirmationOpen(id, 'unarchive')}
          />
        ),
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={loading ? skeletonRows : products ?? []} />

      <ConfirmationModal
        open={confirmationOpen}
        entityName="этот товар"
        actionType={actionType}
        onConfirm={handleConfirmationAction}
        onCancel={handleConfirmationClose}
      />
    </div>
  )
}

export default ArchivedProducts
