import React from 'react'
import { Stock } from '@/types'
import { useStockForm } from '../hooks/useStockForm.ts'
import { getFieldError } from '@/utils/getFieldError.ts'
import { inputChangeHandler } from '@/utils/inputChangeHandler.ts'
import { InputWithError } from '@/components/ui/input-with-error.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Loader2 } from 'lucide-react'

interface Props {
  initialData?: Stock | undefined
  onSuccess?: () => void
}

const StockForm: React.FC<Props> = ({ initialData, onSuccess }) => {
  const { isLoading, form, setForm, errors, handleBlur, error, submitFormHandler } = useStockForm(
    initialData,
    onSuccess,
  )

  return (
    <form onSubmit={submitFormHandler} className="space-y-4">
      <h3 className="text-md sm:text-2xl font-semibold text-center">
        {initialData ? 'Редактировать данные склада' : 'Добавить новый склад'}
      </h3>

      <InputWithError
        name="name"
        placeholder={'Название склада, например: "Склад Бишкек"'}
        value={form.name}
        onChange={e => inputChangeHandler(e, setForm)}
        error={errors.name || getFieldError('name', error)}
        onBlur={e => handleBlur('name', e.target.value)}
      />

      <InputWithError
        name="address"
        placeholder="Адрес склада"
        value={form.address}
        onChange={e => inputChangeHandler(e, setForm)}
        error={errors.address || getFieldError('address', error)}
        onBlur={e => handleBlur('address', e.target.value)}
      />

      <Button type="submit" disabled={isLoading} className="w-full mt-3">
        {initialData ? 'Сохранить' : 'Создать'}
        {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
      </Button>
    </form>
  )
}

export default StockForm
