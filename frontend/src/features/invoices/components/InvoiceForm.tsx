import { Arrival, Order, ServiceArrival } from '@/types'
import { getFieldError } from '@/utils/getFieldError.ts'
import { inputChangeHandler } from '@/utils/inputChangeHandler.ts'
import React from 'react'
import { getArrayItemNameById } from '@/utils/getArrayItemName.ts'
import { Button } from '@/components/ui/button.tsx'
import { Loader2, Plus } from 'lucide-react'
import { CustomSelect } from '@/components/CustomSelect/CustomSelect.tsx'
import { Label } from '@/components/ui/label.tsx'
import { InputWithError } from '@/components/ui/input-with-error.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { cn } from '@/lib/utils.ts'
import FormAccordion from '@/components/FormAccordion/FormAccordion.tsx'
import { useInvoiceForm } from '../hooks/useInvoiceForm'
import { InvoiceData } from '../types/invoiceTypes'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { invoiceStatusStyles } from '@/utils/commonStyles'
import { formatMoney } from '@/utils/formatMoney.ts'

interface Props {
  initialData?: InvoiceData | undefined
  onSuccess?: () => void
}

const InvoiceForm: React.FC<Props> = ({ initialData, onSuccess }) => {
  const {
    services,
    isLoading,
    form,
    setForm,
    errors,
    servicesModalOpen,
    setServicesModalOpen,
    newService,
    setNewService,
    servicesForm,
    setServicesForm,
    openModal,
    addItem,
    deleteItem,
    handleBlur,
    error,
    submitFormHandler,
    clients,
    activePopover,
    setActivePopover,
    availableArrivals,
    availableOrders,
    totalAmount,
    availableArrivalsWithDummy,
    availableOrdersWithDummy,
    invoiceStatus,
  } = useInvoiceForm(initialData, onSuccess)

  return (
    <>
      <form onSubmit={submitFormHandler} className="space-y-4">
        <h3 className="text-md sm:text-2xl font-semibold text-center">
          {initialData ? 'Редактировать данные счёта' : 'Добавить новый счет'}
        </h3>

        <CustomSelect
          label="Клиент"
          value={clients?.find(c => c._id === form.client)?.name}
          placeholder="Выберите клиента"
          options={clients || []}
          onSelect={clientId => {
            setForm(prev => ({ ...prev, client: clientId }))
            handleBlur('client', clientId)
          }}
          popoverKey="client"
          searchPlaceholder="Поиск клиента..."
          activePopover={activePopover}
          setActivePopover={setActivePopover}
          error={errors.client || getFieldError('client', error)}
          onBlur={e => handleBlur('client', e.target.value)}
          renderValue={client => client.name}
        />

        <CustomSelect<Pick<Arrival, '_id' | 'arrivalNumber'>>
          label="Поставка"
          value={availableArrivals?.find(c => c._id === form.associatedArrival)?.arrivalNumber}
          placeholder="Выберите поставку"
          options={availableArrivalsWithDummy}
          onSelect={id => setForm(prev => ({ ...prev, associatedArrival: id }))}
          popoverKey="arrival"
          searchPlaceholder="Поиск поставки..."
          activePopover={activePopover}
          setActivePopover={setActivePopover}
          error={errors.associatedArrival || getFieldError('associatedArrival', error)}
          onBlur={e => handleBlur('associatedArrival', e.target.value)}
          renderValue={x => x.arrivalNumber ?? x._id}
        />

        <CustomSelect<Pick<Order, '_id' | 'orderNumber'>>
          label="Заказ"
          value={availableOrders?.find(c => c._id === form.associatedOrder)?.orderNumber}
          placeholder="Выберите заказ"
          options={availableOrdersWithDummy}
          onSelect={id => setForm(prev => ({ ...prev, associatedOrder: id }))}
          popoverKey="order"
          searchPlaceholder="Поиск заказа..."
          activePopover={activePopover}
          setActivePopover={setActivePopover}
          onBlur={e => handleBlur('associatedOrder', e.target.value)}
          renderValue={x => x.orderNumber ?? x._id}
        />

        <Separator />

        <div>
          <FormAccordion<ServiceArrival>
            title="Дополнительные услуги"
            items={servicesForm}
            onDelete={i => deleteItem(i, setServicesForm)}
            getNameById={i => getArrayItemNameById(services, i, true)}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => openModal()}
            className={cn(servicesModalOpen && 'hidden')}
          >
            <Plus size={17} /> Услуги
          </Button>
        </div>

        {servicesModalOpen && (
          <div className="space-y-2.5">
            <CustomSelect
              label="Услуга"
              value={services?.find(s => s._id === newService.service)?.name}
              placeholder="Выберите услугу"
              options={services || []}
              onSelect={serviceId => {
                setNewService(prev => ({
                  ...prev,
                  service: serviceId,
                  service_type: prev.service_type ?? services.find(s => s._id === serviceId)?.type,
                }))
                handleBlur('service', serviceId)
              }}
              popoverKey="service"
              searchPlaceholder="Поиск услуги..."
              activePopover={activePopover}
              setActivePopover={setActivePopover}
              error={errors.service || getFieldError('service', error)}
              onBlur={e => handleBlur('service', e.target.value)}
              renderValue={service => service.name}
            />

            <Label htmlFor="service_amount">Количество</Label>
            <InputWithError
              id="service_amount"
              type="number"
              placeholder="Количество"
              name="service_amount"
              value={newService.service_amount || ''}
              onChange={e => setNewService(prev => ({ ...prev, service_amount: +e.target.value }))}
              error={errors.service_amount || getFieldError('service_amount', error)}
              onBlur={e => handleBlur('service_amount', e.target.value)}
            />

            <Label htmlFor="service_price">Цена (за 1)</Label>
            <InputWithError
              id="service_price"
              type="number"
              placeholder="Цена услуги"
              name="service_price"
              value={newService.service_price || services.find(s => s._id === newService.service)?.price || ''}
              onChange={e => {
                const newPrice = +e.target.value
                setNewService(prev => ({
                  ...prev,
                  service_price: newPrice >= 0 ? newPrice : prev.service_price,
                }))
              }}
              error={errors.service_price || getFieldError('service_price', error)}
            />

            {newService.service_price !== undefined &&
              newService.service_price !== null &&
              newService.service_price !== 0 && (
              <p className="text-destructive font-bold text-sm mb-2">
                  Указанная цена перезапишет стандартную стоимость услуги при выставлении счёта!
              </p>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => addItem()}>
                Добавить
              </Button>

              <Button type="button" variant="outline" onClick={() => setServicesModalOpen(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-2.5">
          <Label htmlFor="total_amount">К оплате</Label>
          <Input id="total_amount" name="total_amount" placeholder="К оплате" value={`${ formatMoney(totalAmount) } ₽`} disabled />
        </div>

        <Separator />

        <div className="flex justify-between">
          <Label>Статус</Label>
          <Badge
            className={`justify-between gap-2 px-3 py-1 rounded-md text-sm font-medium ${ invoiceStatusStyles[invoiceStatus] }`}          >
            {invoiceStatus as string}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-2.5">
          <Label htmlFor="amount">Оплачено</Label>
          <InputWithError
            id="paid_amount"
            type="number"
            name="paid_amount"
            placeholder="Оплачено"
            value={form.paid_amount || ''}
            onChange={e => inputChangeHandler(e, setForm)}
            error={errors.paid_amount || getFieldError('paid_amount', error)}
            onBlur={e => handleBlur('paid_amount', e.target.value)}
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="discount">Скидка (%)</Label>
          <InputWithError
            id="discount"
            type="number"
            name="discount"
            placeholder="Скидка"
            min={0}
            max={100}
            value={form.discount || ''}
            onChange={e => inputChangeHandler(e, setForm)}
            error={errors.discount || getFieldError('discount', error)}
            onBlur={e => handleBlur('discount', e.target.value)}
          />
        </div>

        <Separator />

        <Button type="submit" className="w-full mt-3" disabled={isLoading}>
          {initialData ? 'Сохранить' : 'Создать'}
          {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
        </Button>
      </form>
    </>
  )
}

export default InvoiceForm
