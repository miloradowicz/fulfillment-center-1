import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Phone, Receipt } from 'lucide-react'
import ConfirmationModal from '@/components/Modal/ConfirmationModal'
import Loader from '@/components/Loader/Loader'
import BackButton from '@/components/Buttons/BackButton'
import EditButton from '@/components/Buttons/EditButton'
import ArchiveButton from '@/components/Buttons/ArchiveButton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import CopyText from '@/components/CopyText/CopyText'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement'
import useInvoiceDetails from '../hooks/useInvoiceDetails'
import InvoiceServicesTable from '@/components/Tables/InvoiceServicesTable.tsx'
import { Button } from '@/components/ui/button.tsx'
import { capitalize } from '@/utils/capitalizeFirstLetter'
import Modal from '@/components/Modal/Modal'
import InvoiceForm from '../components/InvoiceForm'
import { formatMoney } from '@/utils/formatMoney.ts'
import LogsAccordionView from '@/components/LogsAccordionView/LogsAccordionView.tsx'

const InvoiceDetails = () => {
  const {
    invoice,
    loading,
    editModalOpen,
    setEditModalOpen,
    confirmArchiveModalOpen,
    setConfirmArchiveModalOpen,
    handleArchive,
    tabs,
    setTabs,
    invoiceStatusStyles,
    tabStyles,
    handleExport,
  } = useInvoiceDetails()

  return (
    <>
      {loading && <Loader />}

      {invoice ? (
        <>
          <Modal open={editModalOpen} handleClose={() => setEditModalOpen(false)}>
            <InvoiceForm initialData={{ ...invoice, associatedArrival: invoice.associatedArrival?._id, associatedOrder: invoice.associatedOrder?._id }} onSuccess={() => setEditModalOpen(false)} />
          </Modal>

          <ConfirmationModal
            open={confirmArchiveModalOpen}
            entityName="этот счёт"
            actionType="archive"
            onConfirm={handleArchive}
            onCancel={() => setConfirmArchiveModalOpen(false)}
          />

          <div className="w-full max-w-[700px] mx-auto px-4 sm:space-y-7 space-y-5 text-primary">
            <BackButton />

            <div className="rounded-2xl shadow p-6 flex flex-col md:flex-row md:justify-between gap-6">
              <div>
                <Badge className={cn(invoiceStatusStyles[invoice.status], 'p-1.5 font-bold')}>
                  {capitalize(invoice.status)}
                </Badge>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold mt-4 flex gap-1 items-center">
                    <Receipt />
                    {invoice.invoiceNumber}
                  </h3>

                  <div className="text-md">
                    <p className="text-sm text-muted-foreground font-bold">
                      Клиент: <br />
                    </p>

                    <Link
                      to={`/clients/${ invoice.client._id }`}
                      className="inline-flex items-center gap-1 font-bold hover:text-blue-500 transition-colors"
                    >
                      {invoice.client.name}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="flex gap-2 items-center">
                    <CopyText text={invoice.client.phone_number} children={<Phone className="h-4 w-4" />} />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Дата создания: <br />
                    {dayjs(invoice.createdAt).format('D MMMM YYYY')}
                  </p>

                  {invoice.associatedArrival && (
                    <p>
                      <span className="font-bold">Поставка: </span>

                      <Link
                        to={`/arrivals/${ invoice.associatedArrival._id }`}
                        className="hover:text-blue-500 inline-flex items-center gap-1"
                      >
                        {invoice.associatedArrival.arrivalNumber}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </p>
                  )}

                  {invoice.associatedOrder && (
                    <p>
                      <span className="font-bold">Заказ: </span>

                      <Link
                        to={`/orders/${ invoice.associatedOrder._id }`}
                        className="hover:text-blue-500 inline-flex items-center gap-1"
                      >
                        {invoice.associatedOrder.orderNumber}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-[250px] mx-auto md:mx-0 md:items-end">
                <div className="flex gap-2">
                  <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                    <EditButton onClick={() => setEditModalOpen(true)} />
                  </ProtectedElement>

                  <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
                    <ArchiveButton onClick={() => setConfirmArchiveModalOpen(true)} />
                  </ProtectedElement>
                </div>

                <Button
                  onClick={handleExport}
                  className="w-full font-bold text-xs bg-muted hover:bg-primary text-primary hover:text-white transition-colors"
                >
                  Экспортировать в Excel
                </Button>
              </div>
            </div>

            <div className="rounded-2xl shadow p-6 mb-6">
              <h3 className="font-bold uppercase mb-3 text-muted-foreground">Детали счёта</h3>

              <Tabs value={tabs.toString()} onValueChange={val => setTabs(Number(val))}>
                <TabsList className="mb-5 w-full rounded-2xl">
                  <div className="inline-flex flex-nowrap px-2 space-x-2 sm:space-x-4 overflow-x-auto">
                    {Array.isArray(invoice?.associatedArrivalServices) &&
                      invoice?.associatedArrivalServices.length > 0 && (
                      <TabsTrigger value="0" className={tabStyles}>
                          Поставка
                      </TabsTrigger>
                    )}

                    {Array.isArray(invoice?.associatedOrderServices) && invoice?.associatedOrderServices.length > 0 && (
                      <TabsTrigger value="1" className={tabStyles}>
                        Заказ
                      </TabsTrigger>
                    )}

                    {invoice.services?.length > 0 && (
                      <TabsTrigger value="3" className={tabStyles}>
                        Доп. услуги
                      </TabsTrigger>
                    )}

                    <TabsTrigger value="2" className={tabStyles}>
                      История
                    </TabsTrigger>
                  </div>
                </TabsList>

                {Array.isArray(invoice?.associatedArrivalServices) && invoice?.associatedArrivalServices.length > 0 && (
                  <TabsContent value="0">
                    <InvoiceServicesTable services={invoice?.associatedArrivalServices} />
                  </TabsContent>
                )}

                {Array.isArray(invoice?.associatedOrderServices) && invoice?.associatedOrderServices.length > 0 && (
                  <TabsContent value="1">
                    <InvoiceServicesTable services={invoice?.associatedOrderServices} />
                  </TabsContent>
                )}

                {invoice.services?.length > 0 && (
                  <TabsContent value="3">
                    <InvoiceServicesTable services={invoice.services} discount={invoice.discount} />
                  </TabsContent>
                )}

                <TabsContent value="2">
                  {invoice.logs && invoice.logs.length > 0 ? (
                    <LogsAccordionView logs={invoice.logs} />
                  ) : (
                    <p className="px-2 text-sm text-muted-foreground">История изменений отсутствует</p>
                  )}
                </TabsContent>

                <div className="mt-6 border-t pt-4">
                  <div className="flex sm:flex-row flex-col justify-between items-start">
                    <div className="space-y-1 text-left">
                      {invoice.discount ? (
                        <div className="text-xs sm:text-sm font-semibold text-blue-400">
                          Скидка на внутренние услуги: {invoice.discount}%
                        </div>
                      ) : null}

                      <div className="text-base sm:text-sm font-bold text-primary">
                        Итого: {formatMoney(invoice.totalAmount)} ₽
                      </div>
                    </div>

                    {invoice.paid_amount !== undefined && (
                      <div className="text-right sm:text-left">
                        <div className="font-bold text-emerald-600 sm:text-sm">
                          Оплачено: {formatMoney(invoice.paid_amount)} ₽
                        </div>
                        {invoice.paid_amount < (invoice.totalAmount ?? 0) && (
                          <div className="font-bold text-destructive sm:text-sm text-left">
                            Долг: {formatMoney((invoice.totalAmount ?? 0) - invoice.paid_amount)} ₽
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Tabs>
            </div>
          </div>
        </>
      ) : (
        <p className="font-bold text-center text-lg mt-6">Счёт не найден</p>
      )}
    </>
  )
}

export default InvoiceDetails
