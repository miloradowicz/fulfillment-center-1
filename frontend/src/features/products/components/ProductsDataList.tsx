import { ProductWithPopulate } from '@/types'
import useProductActions from '../hooks/useProductActions.ts'
import Modal from '@/components/Modal/Modal.tsx'
import ProductForm from './ProductForm.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { ColumnDef } from '@tanstack/react-table'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn.tsx'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader.tsx'
import TableActionsMenu from '@/components/DataTable/TableActionsMenu/TableActionsMenu.tsx'
import DataTable from '@/components/DataTable/DataTable.tsx'

const ProductsDataList = () => {
  const {
    products,
    selectedProduct,
    open,
    confirmationOpen,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationArchive,
    handleClose,
    handleOpen,
    fetchAllProducts,
  } = useProductActions(true)

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
        const tableProduct = row.original

        return (
          <TableActionsMenu<ProductWithPopulate>
            row={tableProduct}
            handleOpen={handleOpen}
            handleConfirmationOpen={handleConfirmationOpen}
            showDetailsLink={true}
            detailsPathPrefix="products"
          />
        )
      },
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={products ?? []} />

      <Modal handleClose={handleClose} open={open}>
        <ProductForm
          initialData={selectedProduct || undefined}
          onSuccess={() => {
            void fetchAllProducts()
            handleClose()
          }}
        />
      </Modal>

      <ConfirmationModal
        open={confirmationOpen}
        entityName="этот товар"
        actionType={'archive'}
        onConfirm={handleConfirmationArchive}
        onCancel={handleConfirmationClose}
      />
    </div>
  )
}

export default ProductsDataList
