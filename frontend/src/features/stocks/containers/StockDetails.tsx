import { useStockDetails } from '../hooks/useStockDetails.ts'
import Modal from '@/components/Modal/Modal.tsx'
import StockForm from '../components/StockForm.tsx'
import EditButton from '@/components/Buttons/EditButton.tsx'
import BackButton from '@/components/Buttons/BackButton.tsx'
import ArchiveButton from '@/components/Buttons/ArchiveButton.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StockProductsPage from './StockProductsPage.tsx'
import StockDefectsPage from './StockDefectsPage.tsx'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'
import WriteOffForm from '../components/WriteOffForm.tsx'
import { MapPinIcon, Warehouse } from 'lucide-react'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import StockWriteOffsPage from './StockWriteOffsPage.tsx'
import LogsAccordionView from '@/components/LogsAccordionView/LogsAccordionView.tsx'

const StockDetails = () => {
  const {
    stock,
    archiveModalOpen,
    showArchiveModal,
    hideArchiveModal,
    handleArchive,
    editModalOpen,
    setEditModalOpen,
    writeOffModalOpen,
    openWriteOffModal,
    closeWriteOffModal,
    tabs,
    currentTab,
    handleTabChange,
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

      <Modal open={writeOffModalOpen} handleClose={closeWriteOffModal}>
        <WriteOffForm
          initialData={(stock && { stock: stock }) ?? undefined}
          onSuccess={() => {
            closeWriteOffModal()
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

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-7 my-6">
        <div className="flex sm:flex-row flex-col sm:items-center justify-between items-start gap-4">
          <BackButton />

          <div className="text-center flex items-center justify-center gap-3 sm:mt-5">
            <ProtectedElement allowedRoles={['super-admin', 'admin']}>
              <EditButton onClick={() => setEditModalOpen(true)} />
            </ProtectedElement>
            <ProtectedElement allowedRoles={['super-admin', 'admin']}>
              <ArchiveButton onClick={showArchiveModal} />
            </ProtectedElement>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full max-w-[1000px] mx-auto sm:my-7 my-5">
          <div className="space-y-1 text-primary">
            <h3 className="font-bold sm:text-lg text-sm flex items-center gap-2">
              <Warehouse className="h-5 w-5" />
              Склад: {stock?.name}
            </h3>

            <h3 className="font-bold sm:text-lg text-sm flex items-center gap-2">
              <MapPinIcon className="h-5 w-5" />
              Адрес: {stock?.address}
            </h3>
          </div>

          <div className="w-full sm:w-auto">
            <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
              <CustomButton text="Добавить списание" onClick={openWriteOffModal} />
            </ProtectedElement>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <div className="flex justify-center">
            <TabsList className="flex flex-wrap justify-center gap-3 my-3 rounded-2xl">
              {tabs.map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="font-bold data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 text-sm rounded-xl transition-all"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="products" className="mt-0">
            <StockProductsPage />
          </TabsContent>
          <TabsContent value="defects">
            <StockDefectsPage />
          </TabsContent>
          <TabsContent value="write-offs">
            <StockWriteOffsPage />
          </TabsContent>
          <TabsContent value="logs">
            {stock?.logs && stock.logs.length > 0 ? (
              <LogsAccordionView logs={stock.logs} />
            ) : (
              <p className="px-2 text-sm text-muted-foreground">История изменений отсутствует</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default StockDetails
