import dayjs from 'dayjs'
import useArrivalDetails from '../hooks/useArrivalDetails'
import Modal from '@/components/Modal/Modal'
import ArrivalForm from '../components/ArrivalForm'
import { Link } from 'react-router-dom'
import ProductsTable from '@/components/Tables/ProductsTable'
import { basename } from 'path-browserify'
import ConfirmationModal from '@/components/Modal/ConfirmationModal'
import ArchiveButton from '../../../components/Buttons/ArchiveButton'
import BackButton from '@/components/Buttons/BackButton'
import EditButton from '@/components/Buttons/EditButton'
import Loader from '@/components/Loader/Loader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ArrowUpRight, File, Phone, Truck } from 'lucide-react'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'
import CopyText from '@/components/CopyText/CopyText.tsx'
import { arrivalStatusStyles, tabTriggerStyles } from '@/utils/commonStyles.ts'
import { capitalize } from '@/utils/capitalizeFirstLetter.ts'
import LogsAccordionView from '@/components/LogsAccordionView/LogsAccordionView.tsx'
import ServicesTable from '@/components/Tables/ServicesTable.tsx'
import CancelButton from '@/components/Buttons/CancelButton.tsx'

const ArrivalDetails = () => {
  const {
    arrival,
    loading,
    confirmArchiveModalOpen,
    handleArchive,
    editModalOpen,
    setEditModalOpen,
    setConfirmArchiveModalOpen,
    tabs,
    setTabs,
    confirmCancelModalOpen,
    handleCancel,
    setConfirmCancelModalOpen,
    paddingTop,
    heightTab,
  } = useArrivalDetails()

  return (
    <>
      {loading && <Loader />}
      {arrival ? (
        <>
          <Modal open={editModalOpen} handleClose={() => setEditModalOpen(false)}>
            <ArrivalForm initialData={arrival} onSuccess={() => setEditModalOpen(false)} />
          </Modal>

          <ConfirmationModal
            open={confirmArchiveModalOpen}
            entityName="эту поставку"
            actionType="archive"
            onConfirm={handleArchive}
            onCancel={() => setConfirmArchiveModalOpen(false)}
          />
          <ConfirmationModal
            open={confirmCancelModalOpen}
            entityName="эту поставку"
            actionType="cancel"
            onConfirm={handleCancel}
            onCancel={() => setConfirmCancelModalOpen(false)}
          />

          <div className="w-full max-w-[600px] mx-auto px-4 sm:space-y-7 space-y-5 text-primary">
            <BackButton />

            <div className="rounded-2xl shadow p-6 flex flex-col md:flex-row md:justify-between gap-6">
              <div>
                <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                  <CancelButton onClick={() => setConfirmCancelModalOpen(true)} />
                </ProtectedElement>
                <Badge
                  className={cn(
                    arrivalStatusStyles[arrival.arrival_status] || arrivalStatusStyles.default,
                    'py-2 px-2.5 font-bold mb-4',
                  )}
                >
                  {capitalize(arrival.arrival_status)}
                </Badge>

                <div className="space-y-5">
                  <h3 className="text-xl font-bold flex gap-1 items-center mb-3">
                    <Truck /> {arrival.arrivalNumber}
                  </h3>

                  <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground font-bold">Склад</p>
                      <Link
                        to={`/stocks/${ arrival.stock._id }`}
                        className="inline-flex items-center gap-1 font-bold hover:text-blue-500 transition-colors m-0 p-0"
                      >
                        {arrival.stock.name}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </ProtectedElement>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-bold">Дата прибытия</p>
                    <p className="font-bold">{dayjs(arrival.arrival_date).format('D MMMM YYYY')}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-start justify-between">
                <div className="flex gap-2 mt-4 md:mt-0 md:mb-4 order-last md:order-none items-start">
                  <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                    <EditButton onClick={() => setEditModalOpen(true)} />
                  </ProtectedElement>
                  <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                    <ArchiveButton onClick={() => setConfirmArchiveModalOpen(true)} />
                  </ProtectedElement>
                </div>

                <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                  <div className="space-y-1 mb-4">
                    <p className="text-sm text-muted-foreground font-bold">Заказчик</p>

                    <Link
                      to={`/clients/${ arrival.client._id }`}
                      className="inline-flex items-center gap-1 font-bold hover:text-blue-500 transition-colors m-0 p-0"
                    >
                      {arrival.client.name}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>

                    <div className="flex gap-2 items-center">
                      <CopyText text={arrival.client.phone_number} children={<Phone className="h-4 w-4" />} />
                    </div>
                  </div>
                </ProtectedElement>

                <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                  {arrival.shipping_agent && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground font-bold">Контрагент</p>
                      <Link
                        to="/counterparties"
                        className="inline-flex items-center gap-1 font-bold hover:text-blue-500 transition-colors  m-0 p-0"
                      >
                        {arrival.shipping_agent.name}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                      <div className="flex gap-2 items-center">
                        <CopyText text={arrival.shipping_agent.phone_number} children={<Phone className="h-4 w-4" />} />
                      </div>
                    </div>
                  )}
                </ProtectedElement>
              </div>
            </div>

            <div className="rounded-2xl shadow p-6 mb-6">
              <h3 className="font-bold uppercase mb-3 text-muted-foreground text-center">Дополнительно</h3>
              <Tabs value={tabs.toString()} onValueChange={val => setTabs(Number(val))}>
                <TabsList className={`mb-5 w-full ${ heightTab } rounded-2xl`}>
                  <div className={`inline-flex flex-nowrap px-2 space-x-2 sm:space-x-4 overflow-x-auto ${ paddingTop }`} >
                    <TabsTrigger value="0" className={cn(tabTriggerStyles, 'sm:text-sm')}>
                      Отправленные
                    </TabsTrigger>

                    <TabsTrigger value="1" className={cn(tabTriggerStyles, 'sm:text-sm')}>
                      Полученные
                    </TabsTrigger>

                    <TabsTrigger value="2" className={cn(tabTriggerStyles, 'sm:text-sm')}>
                      Дефекты
                    </TabsTrigger>

                    <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                      <TabsTrigger value="3" className={cn(tabTriggerStyles, 'sm:text-sm')}>
                        Услуги
                      </TabsTrigger>
                    </ProtectedElement>

                    <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                      <TabsTrigger value="4" className={cn(tabTriggerStyles, 'sm:text-sm')}>
                        Документы
                      </TabsTrigger>
                    </ProtectedElement>

                    <TabsTrigger value="5" className={cn(tabTriggerStyles, 'sm:text-sm')}>
                      История
                    </TabsTrigger>
                  </div>
                </TabsList>

                <TabsContent value="0">
                  <ProductsTable products={arrival.products} />
                </TabsContent>

                <TabsContent value="1">
                  <ProductsTable products={arrival.received_amount} />
                </TabsContent>

                <TabsContent value="2">{arrival.defects && <ProductsTable defects={arrival.defects} />}</TabsContent>

                <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                  <TabsContent value="3">
                    <ServicesTable services={arrival.services} />
                  </TabsContent>
                </ProtectedElement>

                <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                  <TabsContent value="4">
                    <div
                      className={cn('flex flex-wrap gap-4 mt-3 px-2', !arrival.documents && 'flex-col items-center')}
                    >
                      {arrival.documents ? (
                        arrival.documents.map((doc, idx) => (
                          <Link
                            key={idx}
                            to={`http://localhost:8000/uploads/documents/${ basename(doc.document) }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex justify-center items-center gap-2 hover:text-blue-500 transition-colors"
                          >
                            <File className="h-6 w-6" />
                            <span className="text-xs truncate w-40">{basename(doc.document)}</span>
                          </Link>
                        ))
                      ) : (
                        <p className="text-muted-foreground font-bold text-center text-sm">Документы отсутствуют.</p>
                      )}
                    </div>
                  </TabsContent>
                </ProtectedElement>

                <TabsContent value="5">
                  {arrival.logs && arrival.logs.length > 0 ? (
                    <LogsAccordionView logs={arrival.logs} />
                  ) : (
                    <p className="px-2 text-sm text-muted-foreground">История изменений отсутствует</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      ) : (
        <p className="font-bold text-center text-lg mt-6">Поставка не найдена</p>
      )}
    </>
  )
}

export default ArrivalDetails
