import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { ProductWithPopulate } from '@/types'
import useArchivedProductActions from '../hooks/useArchivedProductsActions.ts'
import TableArchivedActionsMenu from '@/components/DataTable/TableArchivedActionsMenu/TableArchivedActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'
import { ColumnDef } from '@tanstack/react-table'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'

const ArchivedProducts = () => {
  const {
    products,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  } = useArchivedProductActions()

  const columns: ColumnDef<ProductWithPopulate>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'client',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Клиент" />,
      enableColumnFilter: true,
      enableHiding: false,
      cell: info => (info.getValue() as ProductWithPopulate['client'])?.name || '—',

    },
    {
      accessorKey: 'title',
      header: 'Название',
      enableColumnFilter: true,
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'article',
      header: 'Артикул',
      enableColumnFilter: true,
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'barcode',
      header: 'Баркод',
      enableColumnFilter: true,
      cell: info => info.getValue(),
    },
    {
      id: 'actions',
      header: 'Действия',
      enableGlobalFilter: false,
      enableHiding: false,
      cell: ({ row }) => {
        const tableProducts = row.original

        return (
          <TableArchivedActionsMenu<ProductWithPopulate>
            row={tableProducts}
            onDelete={id => handleConfirmationOpen(id, 'delete')}
            onRestore={id => handleConfirmationOpen(id, 'unarchive')}
          />
        )
      },
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={products ?? []}/>

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
