import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box, IconButton, Typography } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { ProductWithPopulate } from '../../../types'
import EditIcon from '@mui/icons-material/Edit'
import { ruRU } from '@mui/x-data-grid/locales'
import { NavLink } from 'react-router-dom'
import useProductActions from '../hooks/useProductActions.ts'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import ProductForm from './ProductForm.tsx'
import ConfirmationModal from '../../../components/UI/Modal/ConfirmationModal.tsx'

const ProductsDataList = () => {
  const {
    products,
    selectedProduct,
    deleteOneProduct,
    open,
    confirmationOpen,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleClose,
    handleOpen,
    fetchAllProducts,
    productToDeleteId,
  } = useProductActions(true)

  const columns: GridColDef<ProductWithPopulate>[] = [
    {
      field: 'title',
      headerName: 'Название',
      flex: 1,
      editable: false,
      sortable: true,
    },
    {
      field: 'client',
      headerName: 'Клиент',
      flex: 1,
      editable: false,
      filterable: true,
      valueGetter: (_value: string, row: ProductWithPopulate) => row.client.name,
    },
    {
      field: 'article',
      headerName: 'Артикул',
      flex: 1,
      sortable: true,
      editable: false,
      filterable: true,
    },
    {
      field: 'barcode',
      headerName: 'Баркод',
      flex: 1,
      sortable: false,
      editable: false,
      filterable: true,
    },
    {
      field: 'Actions',
      headerName: '',
      type: 'number',
      width: 210,
      sortable: false,
      editable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <>
          <IconButton onClick={() => handleOpen(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleConfirmationOpen(row._id)}>
            <ClearIcon />
          </IconButton>
          <NavLink className="text-gray-500 hover:text-gray-700 ml-2"
            to={`/products/${row._id}`}
          >
            Подробнее
          </NavLink>
        </>
      ),
    },
  ]

  return (
    <Box className="max-w-[1000px] mx-auto w-full">
      <Modal handleClose={handleClose} open={open}>
        <ProductForm
          initialData={selectedProduct || undefined}
          onSuccess={() => {
            fetchAllProducts()
            handleClose()
          }}
        />
      </Modal>
      <ConfirmationModal
        open={confirmationOpen}
        entityName="этот товар"
        actionType={'delete'}
        onConfirm={() => void (productToDeleteId && deleteOneProduct(productToDeleteId))}
        onCancel={handleConfirmationClose}
      />
      {products ? (
        <DataGrid
          getRowId={row => row._id}
          rows={products}
          columns={columns}
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      ) : <Typography className="text-center mt-5">Товаров нет</Typography>}
    </Box>
  )
}

export default ProductsDataList
