import { Box, CircularProgress, Typography } from '@mui/material'
import { useStockDetails } from '../hooks/useStockDetails.ts'
import Modal from '@/components/Modal/Modal.tsx'
import StockForm from '../components/StockForm.tsx'
import Grid from '@mui/material/Grid2'
import { DataGrid } from '@mui/x-data-grid'
import { ruRU } from '@mui/x-data-grid/locales'
import EditButton from '@/components/Buttons/EditButton.tsx'
import BackButton from '@/components/Buttons/BackButton.tsx'
import ArchiveButton from '@/components/Buttons/ArchiveButton.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'

const StockDetails = () => {
  const {
    stock,
    isLoading,
    archiveModalOpen,
    showArchiveModal,
    hideArchiveModal,
    handleArchive,
    editModalOpen,
    setEditModalOpen,
    stockColumns,
  } = useStockDetails()

  return (
    <>
      {isLoading ? (
        <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : null}

      <Modal open={editModalOpen} handleClose={() => setEditModalOpen(false)}>
        <StockForm
          initialData={stock || undefined}
          onSuccess={() => {
            setEditModalOpen(false)
          }}
        />
      </Modal>

      <ConfirmationModal
        open={archiveModalOpen}
        entityName="этот склад"
        actionType="archive"
        onConfirm={handleArchive}
        onCancel={hideArchiveModal}
      />

      <div className="max-w-4xl mx-auto mt-6 bg-white rounded-lg shadow-lg p-8 mb-8">
        <BackButton />
        <Box className="text-center mt-4 mb-8 p-4 bg-gray-100 rounded-lg shadow-md">
          <Typography
            sx={{ fontSize: '20px', fontWeight: 700, color: '#1F2937' }}
            className="whitespace-normal break-words"
          >
            📦 Склад: {stock?.name}
          </Typography>

          <Typography
            sx={{ fontSize: '20px', fontWeight: 700, color: '#1F2937', marginTop: '8px' }}
            className="whitespace-normal break-words"
          >
            📍 Адрес: {stock?.address}
          </Typography>
        </Box>

        <Box className="mt-2 bg-gray-100 p-4 rounded-lg shadow-lg">
          <Typography variant="h6" className="mb-7 text-center">
            Товары:
          </Typography>
          <DataGrid
            rows={stock?.products?.map(item => ({
              id: item._id,
              amount: item.amount,
              client: item.product.client.name,
              title: item.product.title,
              article: item.product.article,
              barcode: item.product.barcode,
            }))}
            columns={stockColumns}
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            pageSizeOptions={[5, 10, 20, 100]}
            className="mt-4"
            disableRowSelectionOnClick
          />
        </Box>

        <Box className="text-center mt-8 p-4 flex items-center justify-center gap-3">
          <EditButton onClick={() => setEditModalOpen(true)} />
          <ArchiveButton onClick={showArchiveModal}/>
        </Box>
      </div>
    </>
  )
}

export default StockDetails
