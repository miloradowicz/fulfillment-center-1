import useProductForm from '../hooks/useProductForm.ts'
import { ProductWithPopulate } from '@/types'
import React from 'react'
import { getFieldError } from '@/utils/getFieldError.ts'
import { Loader2, Plus } from 'lucide-react'
import { InputWithError } from '@/components/ui/input-with-error.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import ClientCombobox from '@/components/ClientCombobox/ClientCombobox.tsx'

interface Props {
  initialData?: ProductWithPopulate
  onSuccess?: () => void
}

const ProductForm: React.FC<Props> = ({ initialData, onSuccess }) => {
  const {
    form,
    selectedClient,
    dynamicFields,
    newField,
    showNewFieldInputs,
    clients,
    loadingAdd,
    loadingUpdate,
    inputChangeHandler,
    addDynamicField,
    onChangeDynamicFieldValue,
    onSubmit,
    setForm,
    setSelectedClient,
    setNewField,
    setShowNewFieldInputs,
    setErrors,
    errors,
    createError,
  } = useProductForm(initialData, onSuccess)

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-md sm:text-2xl font-semibold text-center">
        {initialData ? 'Редактировать данные товара' : 'Добавить новый товар'}
      </h3>

      <div className="space-y-1">
        <ClientCombobox
          clients={clients ?? []}
          selectedClientId={selectedClient}
          onSelectClient={id => {
            setSelectedClient(id)
            setForm(prev => ({ ...prev, client: id }))
            setErrors(prev => ({ ...prev, client: '' }))
          }}
          error={errors.client || getFieldError('client', createError)}
        />
      </div>

      <InputWithError
        name="title"
        id="title"
        placeholder="Название"
        value={form.title}
        onChange={inputChangeHandler}
        error={errors.title || getFieldError('title', createError)}
      />

      <InputWithError
        name="barcode"
        id="barcode"
        placeholder="Баркод"
        value={form.barcode}
        onChange={inputChangeHandler}
        error={errors.barcode || getFieldError('barcode', createError)}
      />

      <InputWithError
        name="article"
        placeholder="Артикул"
        value={form.article}
        onChange={inputChangeHandler}
        error={errors.article || getFieldError('article', createError)}
      />

      <h6 className="font-bold text-sm sm:text-md">Дополнительные параметры</h6>
      {dynamicFields.map((field, i) => (
        <Input
          key={field.key || i}
          placeholder={field.label}
          value={field.value || ''}
          onChange={e => onChangeDynamicFieldValue(i, e)}
        />
      ))}

      {showNewFieldInputs && (
        <div className="flex-col space-y-4">
          <Input
            placeholder="Ключ"
            value={newField.key}
            onChange={e => setNewField({ ...newField, key: e.target.value })}
          />
          <Input
            placeholder="Название"
            value={newField.label}
            onChange={e => setNewField({ ...newField, label: e.target.value })}
          />

          <div className="flex gap-3 justify-start">
            <Button type="button" onClick={addDynamicField}>
              Добавить
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowNewFieldInputs(false)}>
              Отмена
            </Button>
          </div>
        </div>
      )}

      {!showNewFieldInputs && (
        <Button type="button" variant="outline" onClick={() => setShowNewFieldInputs(true)}>
          <Plus className=" h-4 w-4" /> Добавить параметр
        </Button>
      )}

      <Button type="submit" className="w-full mt-3" disabled={loadingAdd || loadingUpdate}>
        {initialData ? 'Обновить товар' : 'Создать товар'}
        {loadingAdd || loadingUpdate ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
      </Button>
    </form>
  )
}

export default ProductForm
