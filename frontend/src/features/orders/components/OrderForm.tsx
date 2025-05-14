import { inputChangeHandler } from '@/utils/inputChangeHandler.ts'
import { getFieldError } from '@/utils/getFieldError.ts'
import { useOrderForm } from '../hooks/useOrderForm.ts'
import React from 'react'
import { ItemType, OrderStatus } from '@/constants.ts'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import FileAttachments from '@/components/FileAttachment/FileAttachment.tsx'
import { initialItemState, initialServiceState } from '@/features/orders/state/orderState.ts'
import { Defect, ProductOrder, ServiceArrival } from '@/types.js'
import { getArrayItemNameById } from '@/utils/getArrayItemName.ts'
import { OrderData } from '../utils/orderTypes.ts'
import { CustomSelect } from '@/components/CustomSelect/CustomSelect.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import FormAccordion from '@/components/FormAccordion/FormAccordion.tsx'
import { cn } from '@/lib/utils.ts'
import { LoaderCircle, Plus } from 'lucide-react'
import { Label } from '@/components/ui/label.tsx'
import { InputWithError } from '@/components/ui/input-with-error.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import FormDatePicker from '@/components/FormDatePicker/FormDatePicker.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'

interface Props {
  initialData?: OrderData | undefined
  onSuccess?: () => void
}

const OrderForm: React.FC<Props> = ({ initialData, onSuccess }) => {
  const {
    form,
    setForm,
    errors,
    clientProducts,
    productsForm,
    setProductsForm,
    defectsForm,
    setDefectForm,
    servicesForm,
    setServicesForm,
    loading,
    clients,
    handleBlur,
    onSubmit,
    availableItems,
    files,
    handleFileChange,
    stocks,
    handleRemoveFile,
    handleRemoveExistingFile,
    existingFiles,
    handleModalCancel,
    handleModalConfirm,
    openDeleteModal,
    productsModalOpen,
    defectsModalOpen,
    servicesModalOpen,
    setNewService,
    services,
    newService,
    openModal,
    addItem,
    deleteItem,
    setNewItem,
    error,
    newItem,
    activePopover,
    setActivePopover,
    closeModalProduct,
    closeModalDefect,
    closeModalService,
  } = useOrderForm(initialData, onSuccess)
  console.log(productsForm)
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-md sm:text-2xl font-semibold text-center">
          {initialData ? 'Редактировать данные заказа' : 'Добавить новый заказ'}
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

        <CustomSelect
          label="Склад"
          value={stocks?.find(s => s._id === form.stock)?.name}
          placeholder="Склад, с которого будет отправлен товар"
          options={stocks || []}
          onSelect={stockId => {
            setForm(prev => ({ ...prev, stock: stockId }))
            handleBlur('stock', stockId)
          }}
          popoverKey="stock"
          searchPlaceholder="Поиск склада..."
          activePopover={activePopover}
          setActivePopover={setActivePopover}
          error={errors.stock || getFieldError('stock', error)}
          onBlur={e => handleBlur('stock', e.target.value)}
          renderValue={stock => stock.name}
        />

        <Label htmlFor="price">Сумма заказа</Label>
        <InputWithError
          id="price"
          type="number"
          name="price"
          placeholder="Укажите сумму заказа"
          value={form.price || ''}
          onChange={e => inputChangeHandler(e, setForm)}
          error={errors.price || getFieldError('price', error)}
          onBlur={e => handleBlur('price', e.target.value)}
        />

        <FormDatePicker
          label="Дата отправки"
          value={form.sent_at}
          onChange={value => setForm(prev => ({ ...prev, sent_at: value }))}
          onBlur={e => handleBlur('sent_at', e.target.value)}
          error={errors.sent_at || getFieldError('sent_at', error)}
          className="w-full"
        />

        <FormDatePicker
          label="Дата доставки"
          value={form.delivered_at || ''}
          onChange={value => setForm(prev => ({ ...prev, delivered_at: value }))}
          className="w-full"
        />

        <CustomSelect
          label="Статус заказа"
          value={form.status && OrderStatus.includes(form.status) ? form.status : undefined}
          placeholder="Статус заказа"
          options={OrderStatus.map(s => ({ _id: s }))}
          onSelect={value => {
            setForm(prev => ({ ...prev, status: value }))
            handleBlur('status', value)
          }}
          popoverKey="status"
          searchPlaceholder="Поиск статуса заказа..."
          activePopover={activePopover}
          setActivePopover={setActivePopover}
          error={errors.status || getFieldError('status', error)}
          renderValue={item => item._id}
          onBlur={e => handleBlur('status', e.target.value)}
        />

        <Separator />

        <div>
          <FormAccordion<ProductOrder>
            title="Товары"
            items={productsForm}
            onDelete={i => deleteItem(i, setProductsForm)}
            getNameById={i => getArrayItemNameById(clientProducts, i)}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => openModal(ItemType.PRODUCTS, initialItemState)}
            className={cn(productsModalOpen && 'hidden')}
          >
            <Plus size={17} /> Товары
          </Button>
        </div>

        {productsModalOpen && (
          <div className="space-y-2.5">
            <CustomSelect
              label="Товар"
              value={
                availableItems?.find(p => p._id === newItem.product) &&
                `${ availableItems.find(p => p._id === newItem.product)!.title }. Артикул: ${ availableItems.find(p => p._id === newItem.product)!.article }`
              }
              placeholder="Выберите товар"
              options={availableItems || []}
              onSelect={productId => {
                setNewItem(prev => ({ ...prev, product: productId }))
                handleBlur('product', productId)
              }}
              popoverKey="product"
              searchPlaceholder="Поиск товара..."
              activePopover={activePopover}
              setActivePopover={setActivePopover}
              error={errors.product || getFieldError('product', error)}
              onBlur={e => handleBlur('product', e.target.value)}
              renderValue={product => `${ product.title }. Артикул: ${ product.article }`}
            />

            <Label htmlFor="amount">Количество</Label>
            <InputWithError
              id="amount"
              type="number"
              name="amount"
              placeholder="Количество товара"
              value={newItem.amount || ''}
              onChange={e => setNewItem(prev => ({ ...prev, amount: +e.target.value }))}
              error={errors.amount || getFieldError('amount', error)}
              onBlur={e => handleBlur('amount', e.target.value)}
            />

            <Label htmlFor="description">Описание</Label>
            <Input
              id="description"
              placeholder="Описание товара"
              name="description"
              value={(newItem as ProductOrder).description || ''}
              onChange={e =>
                setNewItem(prev => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => addItem(ItemType.PRODUCTS)}>
                Добавить
              </Button>

              <Button type="button" variant="outline" onClick={() => closeModalProduct()}>
                Закрыть
              </Button>
            </div>
          </div>
        )}

        <Separator />

        <div>
          <FormAccordion<Defect>
            title="Дефектные товары"
            items={defectsForm}
            onDelete={i => deleteItem(i, setDefectForm)}
            getNameById={i => getArrayItemNameById(clientProducts, i)}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => openModal(ItemType.DEFECTS, initialItemState)}
            className={cn(defectsModalOpen && 'hidden')}
          >
            <Plus size={17} /> Дефекты
          </Button>
        </div>

        {defectsModalOpen && (
          <div className="space-y-2.5">
            <CustomSelect
              label="Дефектный товар"
              value={
                clientProducts?.find(p => p._id === newItem.product) &&
                `${ clientProducts.find(p => p._id === newItem.product)!.title }. Артикул: ${ clientProducts.find(p => p._id === newItem.product)!.article }`
              }
              placeholder="Выберите товар"
              options={availableItems || []}
              onSelect={productId => {
                setNewItem(prev => ({ ...prev, product: productId }))
                handleBlur('product', productId)
              }}
              popoverKey="product"
              searchPlaceholder="Поиск товара..."
              activePopover={activePopover}
              setActivePopover={setActivePopover}
              error={errors.product || getFieldError('product', error)}
              onBlur={e => handleBlur('product', e.target.value)}
              renderValue={product => `${ product.title }. Артикул: ${ product.article }`}
            />

            <Label htmlFor="amount">Количество</Label>
            <InputWithError
              id="amount"
              type="number"
              placeholder="Количество дефектного товара"
              name="amount"
              value={newItem.amount || ''}
              onChange={e => setNewItem(prev => ({ ...prev, amount: +e.target.value }))}
              error={errors.amount || getFieldError('amount', error)}
              onBlur={e => handleBlur('amount', e.target.value)}
            />

            <Label htmlFor="defect_description">Описание</Label>
            <InputWithError
              id="defect_description"
              placeholder="Описание дефекта"
              name="defect_description"
              value={(newItem as Defect).defect_description || ''}
              onChange={e =>
                setNewItem(prev => ({
                  ...prev,
                  defect_description: e.target.value,
                }))
              }
              error={errors.defect_description || getFieldError('defect_description', error)}
              onBlur={e => handleBlur('defect_description', e.target.value)}
            />

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => addItem(ItemType.DEFECTS)}>
                Добавить
              </Button>

              <Button type="button" variant="outline" onClick={() => closeModalDefect()}>
                Закрыть
              </Button>
            </div>
          </div>
        )}

        <Separator />

        <div>
          <FormAccordion<ServiceArrival>
            title="Услуги"
            items={servicesForm}
            onDelete={i => deleteItem(i, setServicesForm)}
            getNameById={i => getArrayItemNameById(services, i, true)}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => openModal(ItemType.SERVICES, initialServiceState)}
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
                setNewService(prev => ({ ...prev, service: serviceId }))
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
              <Button type="button" variant="outline" onClick={() => addItem(ItemType.SERVICES)}>
                Добавить
              </Button>

              <Button type="button" variant="outline" onClick={() => closeModalService()}>
                Закрыть
              </Button>
            </div>
          </div>
        )}

        <Separator />

        <FileAttachments
          existingFiles={existingFiles}
          onRemoveExistingFile={handleRemoveExistingFile}
          files={files}
          onRemoveFile={handleRemoveFile}
          onFileChange={handleFileChange}
        />

        <div className="space-y-2.5">
          <Label htmlFor="comment">Комментарий к заказу</Label>
          <Textarea
            id="comment"
            name="comment"
            placeholder="Ваш комментарий..."
            value={form.comment}
            onChange={e => inputChangeHandler(e, setForm)}
            className="resize-y min-h-[40px] max-h-[250px] text-sm"
          />
        </div>

        <Button type="submit" className="w-full mt-3" disabled={loading}>
          {initialData ? 'Сохранить' : 'Создать'}
          {loading ? <LoaderCircle className="animate-spin mr-2 h-4 w-4" /> : null}
        </Button>
      </form>

      <ConfirmationModal
        open={openDeleteModal}
        entityName="этот документ"
        actionType="delete"
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </>
  )
}
export default OrderForm
