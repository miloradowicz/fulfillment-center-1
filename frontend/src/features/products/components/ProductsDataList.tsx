import { useCallback, useEffect } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box, IconButton, Typography } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { deleteProduct, fetchProducts } from '../../../store/thunks/productThunk.ts'
import { selectAllProducts } from '../../../store/slices/productSlice.ts'
import { Product } from '../../../types'
import EditIcon from '@mui/icons-material/Edit'

const ProductsDataList = () => {
  const dispatch = useAppDispatch()

  const fetchAllProducts = useCallback(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    void fetchAllProducts()
  }, [dispatch, fetchAllProducts])


  const deleteOneProduct = async (id: string) => {
    await dispatch(deleteProduct(id))
    void fetchAllProducts()
  }

  const products = useAppSelector(selectAllProducts)
  const columns: GridColDef<Product>[] = [
    {
      field: 'title',
      headerName: 'Название',
      flex: 1,
      editable: false,
      sortable:true,
    },
    {
      field: 'client',
      headerName: 'Клиент',
      flex: 1,
      editable: false,
      filterable: true,
      valueGetter: (_value: string, row: Product) => row.client.name,
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
      filterable: true },
    {
      field: 'amount',
      headerName: 'Количество',
      width: 100,
      sortable: true,
      editable: false,
      filterable: true },
    {
      field: 'Actions',
      headerName: '',
      type: 'number',
      width: 100,
      sortable: false,
      editable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <>
          <IconButton>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deleteOneProduct(row._id)}>
            <ClearIcon />
          </IconButton>
        </>
      ),
    },
  ]
  return (
    <Box sx={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {products ? (
        <DataGrid
          getRowId={row => row._id}
          rows={products}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      ) : <Typography textAlign={'center'}
        marginTop={'20px'}>Товаров нет</Typography>}
    </Box>
  )
}

export default ProductsDataList
