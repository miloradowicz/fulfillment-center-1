import dayjs from 'dayjs'
import useArrivalDetails from '../hooks/useArrivalDetails'
import Modal from '@/components/Modal/Modal'
import ArrivalForm from '../components/ArrivalForm'
import { Link } from 'react-router-dom'
import ProductsTable from '@/components/Tables/ProductsTable'
import { basename } from 'path-browserify'
import LogsTable from '@/components/Tables/LogsTable'
import ConfirmationModal from '@/components/Modal/ConfirmationModal'
import ArchiveButton from '../../../components/Buttons/ArchiveButton'
import BackButton from '@/components/Buttons/BackButton'
import EditButton from '@/components/Buttons/EditButton'
import Loader from '@/components/Loader/Loader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ArrowUpRight, File, Truck } from 'lucide-react'

const statusStyles: Record<string, string> = {
  'ожидается доставка': 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 hover:text-yellow-800',
  'получена': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-900',
  'отсортирована': 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900',
  'default': 'bg-primary/10 text-primary/80 border hover:bg-primary/20 hover:text-primary',
}

const tabStyles =
  'data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-primary/5 hover:text-primary px-4 py-2 text-sm rounded-xl transition-all cursor-pointer'

const ArrivalDetails = () => {
  const {
    arrival,
    loading,
    infoTab,
    productsTab,
    confirmArchiveModalOpen,
    handleArchive,
    editModalOpen,
    setEditModalOpen,
    setConfirmArchiveModalOpen,
    setInfoTab,
    setProductsTabs,
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

          <div className="w-full max-w-4xl mx-auto px-4 sm:space-y-7 space-y-5">
            <BackButton />

            <div className="rounded-2xl shadow p-6 flex flex-col md:flex-row md:justify-between gap-6">
              <div>
                <Badge className={cn(statusStyles[arrival.arrival_status] || statusStyles.default, 'p-1.5 font-bold')}>
                  {arrival.arrival_status}
                </Badge>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold mt-4 flex gap-1 items-center">
                    <Truck />
                    {arrival.arrivalNumber}
                  </h3>
                  <p className="text-md"><span className="font-bold">Склад: </span>{arrival.stock.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Дата прибытия: {dayjs(arrival.arrival_date).format('D MMMM YYYY')}
                  </p>
                </div>

                <div className="mt-5 space-y-1">
                  <p className="text-sm text-muted-foreground font-bold">Заказчик</p>
                  <Link
                    to={`/clients/${ arrival.client._id }`}
                    target="_blank"
                    className="flex items-center gap-1 font-bold hover:text-blue-500 transition-colors"
                  >
                    {arrival.client.name}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <p className="text-sm">{arrival.client.phone_number}</p>
                </div>

                {arrival.shipping_agent && (
                  <div className="mt-5 space-y-1">
                    <p className="text-sm text-muted-foreground font-bold">Контрагент</p>
                    <Link
                      to="/counterparties"
                      target="_blank"
                      className="flex items-center gap-1 font-bold hover:text-blue-500 transition-colors"
                    >
                      {arrival.shipping_agent.name}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <p className="text-sm">{arrival.shipping_agent.phone_number}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center justify-between">
                <div className="flex gap-2">
                  <EditButton onClick={() => setEditModalOpen(true)} />
                  <ArchiveButton onClick={() => setConfirmArchiveModalOpen(true)} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-4 text-muted-foreground uppercase">Товары</h3>
              <Tabs value={productsTab.toString()} onValueChange={val => setProductsTabs(Number(val))}>
                <TabsList className="rounded-2xl overflow-x-auto max-w-full spacy-y-4">
                  <TabsTrigger value="0" className={tabStyles}>
                    Отправленные
                  </TabsTrigger>
                  <TabsTrigger value="1" className={tabStyles}>
                    Полученные
                  </TabsTrigger>
                  <TabsTrigger value="2" className={tabStyles}>
                    Дефекты
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="0">
                  <ProductsTable products={arrival.products} />
                </TabsContent>
                <TabsContent value="1">
                  <ProductsTable products={arrival.received_amount} />
                </TabsContent>
                <TabsContent value="2">{arrival.defects && <ProductsTable defects={arrival.defects} />}</TabsContent>
              </Tabs>
            </div>

            <div className="rounded-2xl shadow p-6 mb-5">
              <h3 className="font-semibold mb-4 text-muted-foreground uppercase">Дополнительно</h3>
              <Tabs value={infoTab.toString()} onValueChange={val => setInfoTab(Number(val))}>
                <TabsList className="rounded-2xl overflow-x-auto max-w-full spacy-y-4">
                  <TabsTrigger value="0" className={tabStyles}>
                    История
                  </TabsTrigger>
                  <TabsTrigger value="1" className={tabStyles}>
                    Документы
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="0" className="mt-3">
                  <LogsTable logs={arrival.logs || []} />
                </TabsContent>
                <TabsContent value="1" className="mt-3">
                  <div className="flex flex-wrap gap-4">
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
                      <p>Документов нет.</p>
                    )}
                  </div>
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
