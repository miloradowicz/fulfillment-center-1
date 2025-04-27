import { WriteOff } from '@/types'
import { getFieldError } from '@/utils/getFieldError.ts'
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
import { StockWriteOffData } from '../utils/writeOffTypes'
import { useWriteOffForm } from '../hooks/useWriteOffForm'

interface Props {
  initialData?: Partial<StockWriteOffData>
  onSuccess?: () => void
}

const WriteOffForm: React.FC<Props> = ({ initialData, onSuccess }) => {
  const {
    products,
    isLoading,
    form,
    setForm,
    newItem,
    setNewItem,
    errors,
    defectsForm,
    setDefectForm,
    writeOffsModalOpen,
    setDefectsModalOpen,
    openModal,
    addItem,
    deleteItem,
    handleBlur,
    error,
    submitFormHandler,
    clients,
    stocks,
    availableItem,
    activePopover,
    setActivePopover,
  } = useWriteOffForm(initialData, onSuccess)

  return (
    <>
      <form onSubmit={submitFormHandler} className="space-y-4">
        <h3 className="text-md sm:text-2xl font-semibold text-center">
          {initialData ? 'Редактировать данные поставки' : 'Добавить новую поставку'}
        </h3>

        <CustomSelect
          disabled
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

        <Separator />

        <div>
          <FormAccordion<WriteOff>
            title="Списания"
            items={defectsForm}
            onDelete={i => deleteItem(i, setDefectForm)}
            getNameById={i => getArrayItemNameById(products, i)}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => openModal()}
            className={cn(writeOffsModalOpen && 'hidden')}
          >
            <Plus size={17} /> Списания
          </Button>
        </div>

        {writeOffsModalOpen && (
          <div className="space-y-2.5">
            <CustomSelect
              label="Товар"
              value={
                products?.find(p => p._id === newItem.product) &&
                `${ products.find(p => p._id === newItem.product)!.title }. Артикул: ${ products.find(p => p._id === newItem.product)!.article }`
              }
              placeholder="Выберите товар"
              options={availableItem || []}
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
              placeholder="Количество списывамого товара"
              name="amount"
              value={newItem.amount || ''}
              onChange={e => setNewItem(prev => ({ ...prev, amount: +e.target.value }))}
              error={errors.amount || getFieldError('amount', error)}
              onBlur={e => handleBlur('amount', e.target.value)}
            />

            <Label htmlFor="reason">Описание</Label>
            <InputWithError
              id="reason"
              placeholder="Причина списания"
              name="reason"
              value={(newItem as WriteOff).reason || ''}
              onChange={e =>
                setNewItem(prev => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              error={errors.reason || getFieldError('reason', error)}
              onBlur={e => handleBlur('reason', e.target.value)}
            />

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => addItem()}>
                Добавить
              </Button>

              <Button type="button" variant="outline" onClick={() => setDefectsModalOpen(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        )}

        <Separator />

        <Button type="submit" className="w-full mt-3" disabled={isLoading}>
          {initialData ? 'Сохранить' : 'Создать'}
          {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
        </Button>
      </form>
    </>
  )
}

export default WriteOffForm
