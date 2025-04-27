import { Box, Typography } from '@mui/material'
import { useStockDetails } from '../hooks/useStockDetails.ts'
import Modal from '@/components/Modal/Modal.tsx'
import StockForm from '../components/StockForm.tsx'
import EditButton from '@/components/Buttons/EditButton.tsx'
import BackButton from '@/components/Buttons/BackButton.tsx'
import ArchiveButton from '@/components/Buttons/ArchiveButton.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StockProductsPage from './StockProductsPage.tsx'
import { useSearchParams } from 'react-router-dom'
import StockDefectsPage from './StockDefectsPage.tsx'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'

const tabs = [
  { value: 'products', label: 'Товары' },
  { value: 'defects', label: 'Брак' },
]

const StockDetails = () => {

  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') || 'products'

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value })
  }

  const {
    stock,
    archiveModalOpen,
    showArchiveModal,
    hideArchiveModal,
    handleArchive,
    editModalOpen,
    setEditModalOpen,
  } = useStockDetails()

  return (
    <>
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

        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <div className="flex justify-center">
            <TabsList className="mb-10 flex flex-wrap justify-center gap-3 sm:gap-4 sm:mb-10">
              {tabs.map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 text-sm sm:text-base rounded-xl transition-all"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="h-px bg-muted mb-3 w-full" />

          <TabsContent value="products" className="mt-0">
            <StockProductsPage />
          </TabsContent>
          <TabsContent value="defects">
            <StockDefectsPage />
          </TabsContent>
        </Tabs>

        <Box className="text-center mt-8 p-4 flex items-center justify-center gap-3">
          <ProtectedElement allowedRoles={['super-admin', 'admin']}>
            <EditButton onClick={() => setEditModalOpen(true)} />
          </ProtectedElement>
          <ProtectedElement allowedRoles={['super-admin', 'admin']}>
            <ArchiveButton onClick={showArchiveModal} />
          </ProtectedElement>
        </Box>
      </div>
    </>
  )
}

export default StockDetails
