import { TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import ItemsList from './ItemsList.tsx'
import { useArrivalForm } from '../hooks/useArrivalForm.ts'
import { Defect, ProductArrival } from '@/types'
import { initialItemState, initialServiceState } from '../state/arrivalState.ts'
import { getFieldError } from '@/utils/getFieldError.ts'
import { inputChangeHandler } from '@/utils/inputChangeHandler.ts'
import React from 'react'
import { getArrayItemNameById } from '@/utils/getArrayItemName.ts'
import { getAutocompleteItemName } from '@/utils/getAutocompleteItemName.ts'
import { ItemType } from '@/constants.ts'
import { ArrivalData } from '../utils/arrivalTypes.ts'
import { Button } from '@/components/ui/button.tsx'
import { Loader2, Plus } from 'lucide-react'
import FileAttachments from '@/components/FileAttachment/FileAttachment.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { CustomSelect } from '@/components/CustomSelect/CustomSelect.tsx'
import { Input } from '@/components/ui/input.tsx'
import FormDatePicker from '@/components/FormDatePicker/FormDatePicker.tsx'
import { Label } from '@/components/ui/label.tsx'
import { InputWithError } from '@/components/ui/input-with-error.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { cn } from '@/lib/utils.ts'

interface Props {
  initialData?: ArrivalData | undefined
  onSuccess?: () => void
}

const ArrivalForm: React.FC<Props> = ({ initialData, onSuccess }) => {
  const {
    products,
    services,
    isLoading,
    form,
    setForm,
    newItem,
    setNewItem,
    errors,
    productsForm,
    setProductsForm,
    receivedForm,
    setReceivedForm,
    defectsForm,
    setDefectForm,
    productsModalOpen,
    setProductsModalOpen,
    receivedModalOpen,
    setReceivedModalOpen,
    defectsModalOpen,
    setDefectsModalOpen,
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
    status,
    clients,
    stocks,
    availableItem,
    counterparties,
    files,
    handleFileChange,
    handleModalConfirm,
    handleModalCancel,
    handleRemoveExistingFile,
    openDeleteModal,
    existingFiles,
    handleRemoveFile,
    activePopover,
    setActivePopover,
  } = useArrivalForm(initialData, onSuccess)

  return (
    <>
      <form onSubmit={submitFormHandler} className="space-y-4">
        <h3 className="text-md sm:text-2xl font-semibold text-center">
          {initialData ? 'Редактировать данные поставки' : 'Добавить новую поставку'}
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
          placeholder="Выберите склад"
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

        <CustomSelect
          label="Компания-перевозчик"
          value={counterparties?.find(c => c._id === form.shipping_agent)?.name}
          placeholder="Компания-перевозчик"
          options={counterparties || []}
          onSelect={counterpartyId => {
            setForm(prev => ({ ...prev, shipping_agent: counterpartyId }))
          }}
          popoverKey="shipping_agent"
          searchPlaceholder="Поиск контрагента..."
          activePopover={activePopover}
          setActivePopover={setActivePopover}
          renderValue={shipping_agent => shipping_agent.name}
        />

        <Label htmlFor="pickup_location">Адрес доставки</Label>
        <Input
          id="pickup_location"
          name="pickup_location"
          placeholder="Адрес доставки"
          value={form.pickup_location}
          onChange={e => inputChangeHandler(e, setForm)}
        />

        <CustomSelect
          label="Статус доставки"
          value={form.arrival_status && status.includes(form.arrival_status) ? form.arrival_status : undefined}
          placeholder="Статус доставки"
          options={status.map(s => ({ _id: s }))}
          onSelect={value => {
            setForm(prev => ({ ...prev, arrival_status: value }))
            handleBlur('arrival_status', value)
          }}
          popoverKey="arrival_status"
          searchPlaceholder="Поиск статуса доставки..."
          activePopover={activePopover}
          setActivePopover={setActivePopover}
          error={errors.arrival_status || getFieldError('arrival_status', error)}
          renderValue={item => item._id}
          onBlur={e => handleBlur('arrival_status', e.target.value)}
        />

        <FormDatePicker
          label="Дата прибытия"
          value={form.arrival_date}
          onChange={value => setForm(prev => ({ ...prev, arrival_date: value }))}
          onBlur={e => handleBlur('arrival_date', e.target.value)}
          error={errors.arrival_date || getFieldError('arrival_date', error)}
          className="w-full"
        />

        <Label htmlFor="sent_amount">Количество отправленного товара</Label>
        <Input
          id="sent_amount"
          name="sent_amount"
          placeholder="Шт/мешков/коробов"
          value={form.sent_amount}
          onChange={e => inputChangeHandler(e, setForm)}
        />

        <Separator/>

        <h6 className="font-bold text-center">Товары</h6>
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => openModal(ItemType.PRODUCTS, initialItemState)}
            className={cn(productsModalOpen && 'hidden')}
          >
            <Plus size={17} /> Отправленные
          </Button>
          <ItemsList<ProductArrival>
            items={productsForm}
            onDelete={i => deleteItem(i, setProductsForm)}
            getNameById={i => getArrayItemNameById(products, i)}
          />
        </div>

        {productsModalOpen && (
          <div>
            <Autocomplete
              fullWidth
              size="small"
              disablePortal
              options={products ?? []}
              onChange={(_, newValue) => {
                if (newValue) {
                  setNewItem(prev => ({ ...prev, product: newValue._id }))
                }
              }}
              getOptionLabel={option => `${ option.title }. Артикул: ${ option.article }`}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Товар"
                  error={Boolean(errors.product || getFieldError('product', error))}
                  helperText={errors.product || getFieldError('product', error)}
                  onBlur={e => handleBlur('product', e.target.value)}
                />
              )}
              sx={{ marginBottom: '15px' }}
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
              value={(newItem as ProductArrival).description || ''}
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

              <Button type="button" variant="outline" onClick={() => setProductsModalOpen(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-2.5">
          <Button
            type="button"
            variant="outline"
            className={cn(receivedModalOpen && 'hidden')}
            onClick={() => openModal(ItemType.RECEIVED_AMOUNT, initialItemState)}
          >
            <Plus size={17} /> Полученные
          </Button>

          <ItemsList<ProductArrival>
            items={receivedForm}
            onDelete={i => deleteItem(i, setReceivedForm)}
            getNameById={i => getArrayItemNameById(products, i)}
          />
        </div>

        {receivedModalOpen && (
          <div className="space-y-2.5">
            <Autocomplete
              fullWidth
              size="small"
              disablePortal
              options={availableItem ?? []}
              onChange={(_, newValue) => {
                if (newValue) {
                  setNewItem(prev => ({ ...prev, product: newValue._id }))
                }
              }}
              getOptionLabel={option => `${ option.title }. Артикул: ${ option.article }`}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Товар"
                  error={Boolean(errors.product || getFieldError('product', error))}
                  helperText={errors.product || getFieldError('product', error)}
                  onBlur={e => handleBlur('product', e.target.value)}
                />
              )}
              sx={{ marginBottom: '15px' }}
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
              value={(newItem as ProductArrival).description || ''}
              onChange={e =>
                setNewItem(prev => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => addItem(ItemType.RECEIVED_AMOUNT)}>
                Добавить
              </Button>

              <Button type="button" variant="outline" onClick={() => setReceivedModalOpen(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        )}

        <Separator/>

        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => openModal(ItemType.DEFECTS, initialItemState)}
            className={cn(defectsModalOpen && 'hidden')}
          >
            <Plus size={17}/> Дефекты
          </Button>

          <ItemsList<Defect>
            items={defectsForm}
            onDelete={i => deleteItem(i, setDefectForm)}
            getNameById={i => getArrayItemNameById(products, i)}
          />

        </div>

        {defectsModalOpen && (
          <div className="space-y-2.5">



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

              <Button type="button" variant="outline" onClick={() => setDefectsModalOpen(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        )}

        <Separator/>

        <div className="space-y-2.5">
          <h6 className="text-start font-bold">Услуги</h6>

          <ItemsList
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
            <Plus size={17}/> Услуги
          </Button>
        </div>

        {servicesModalOpen && (
          <div className="space-y-2.5">
            <Autocomplete
              fullWidth
              size="small"
              disablePortal
              options={getAutocompleteItemName(services, 'name', '_id')}
              onChange={(_, newValue) => {
                if (newValue) {
                  setNewService(prev => ({ ...prev, service: newValue.id }))
                }
              }}
              getOptionLabel={option => `${ option.label }`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Услуга"
                  error={Boolean(errors.service || getFieldError('service', error))}
                  helperText={errors.service || getFieldError('service', error)}
                  onBlur={e => handleBlur('service', e.target.value)}
                />
              )}
              sx={{ marginBottom: '15px' }}
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

            <Label htmlFor="service_price">Цена</Label>
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

              <Button type="button" variant="outline" onClick={() => setServicesModalOpen(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        )}

        <Separator/>

        <FileAttachments
          existingFiles={existingFiles}
          onRemoveExistingFile={handleRemoveExistingFile}
          files={files}
          onRemoveFile={handleRemoveFile}
          onFileChange={handleFileChange}
        />

        <Button type="submit" className="w-full mt-3" disabled={isLoading}>
          {initialData ? 'Сохранить' : 'Создать'}
          {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
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

export default ArrivalForm
