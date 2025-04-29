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
    arrivalStatusStyles,
    tabStyles,
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

          <div className="w-full max-w-[700px] mx-auto px-4 sm:space-y-7 space-y-5 text-primary">
            <BackButton />

            <div className="rounded-2xl shadow p-6 flex flex-col md:flex-row md:justify-between gap-6">
              <div>
                <Badge
                  className={cn(
                    arrivalStatusStyles[arrival.arrival_status] || arrivalStatusStyles.default,
                    'p-1.5 font-bold',
                  )}
                >
                  {arrival.arrival_status}
                </Badge>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold mt-4 flex gap-1 items-center">
                    <Truck />
                    {arrival.arrivalNumber}
                  </h3>
                  <p className="text-md">
                    <span className="font-bold">Склад: </span>
                    {arrival.stock.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Дата прибытия: {dayjs(arrival.arrival_date).format('D MMMM YYYY')}
                  </p>
                </div>

                <div className="mt-5 space-y-1">
                  <p className="text-sm text-muted-foreground font-bold">Заказчик</p>
                  <Link
                    to={`/clients/${ arrival.client._id }`}
                    className="inline-flex items-center gap-1 font-bold hover:text-blue-500 transition-colors"
                  >
                    {arrival.client.name}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <div className="flex gap-2 items-center">
                    <CopyText text={arrival.client.phone_number} children={<Phone className="h-4 w-4" />} />
                  </div>
                </div>

                {arrival.shipping_agent && (
                  <div className="mt-5 space-y-1">
                    <p className="text-sm text-muted-foreground font-bold">Контрагент</p>
                    <Link
                      to="/counterparties"
                      className="inline-flex items-center gap-1 font-bold hover:text-blue-500 transition-colors"
                    >
                      {arrival.shipping_agent.name}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <div className="flex gap-2 items-center">
                      <CopyText text={arrival.shipping_agent.phone_number} children={<Phone className="h-4 w-4" />} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center justify-between">
                <div className="flex gap-2">
                  <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                    <EditButton onClick={() => setEditModalOpen(true)} />
                  </ProtectedElement>
                  <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                    <ArchiveButton onClick={() => setConfirmArchiveModalOpen(true)} />
                  </ProtectedElement>
                </div>
              </div>
            </div>

            <div className="rounded-2xl shadow p-6 mb-6">
              <h3 className="font-bold uppercase mb-3 text-muted-foreground">Дополнительно</h3>
              <Tabs value={tabs.toString()} onValueChange={val => setTabs(Number(val))}>
                <TabsList className="mb-5 w-full rounded-2xl">
                  <div className="inline-flex flex-nowrap px-2 space-x-2 sm:space-x-4 overflow-x-auto">
                    <TabsTrigger value="0" className={tabStyles}>
                      Отправленные
                    </TabsTrigger>
                    <TabsTrigger value="1" className={tabStyles}>
                      Полученные
                    </TabsTrigger>
                    <TabsTrigger value="2" className={tabStyles}>
                      Дефекты
                    </TabsTrigger>
                    <TabsTrigger value="3" className={tabStyles}>
                      Документы
                    </TabsTrigger>
                    <TabsTrigger value="4" className={tabStyles}>
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
                <TabsContent value="3">
                  <div className={cn('flex flex-wrap gap-4 mt-3 px-2', !arrival.documents && 'flex-col items-center')}>
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
                <TabsContent value="4">
                  <p className="px-2">История</p>
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
