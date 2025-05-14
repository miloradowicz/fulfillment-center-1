import { Counterparty } from '@/types'
import { useCounterpartyForm } from '../hooks/useCounterpartyForm.ts'
import { getFieldError } from '@/utils/getFieldError.ts'
import { InputWithError } from '@/components/ui/input-with-error.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { LoaderCircle } from 'lucide-react'

const CounterpartyForm = ({ counterparty, onClose }: { counterparty?: Counterparty | null; onClose?: () => void }) => {
  const {
    form,
    loading,
    inputChangeHandler,
    onSubmit,
    errors,
    createError,
    updateError,
    errorsBlur,
    handleBlur,
  } = useCounterpartyForm(counterparty?._id, onClose)

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-md sm:text-2xl font-semibold text-center">
        {counterparty ? 'Редактировать контрагента' : 'Добавить нового контрагента'}
      </h3>

      <InputWithError
        name="name"
        placeholder="Название компании контрагента"
        value={form.name}
        onChange={inputChangeHandler}
        error={errors.name || getFieldError('name', createError || updateError) || errorsBlur.name}
        onBlur={e => handleBlur('name', e.target.value)}
      />

      <InputWithError
        name="phone_number"
        placeholder="Номер телефона"
        value={form.phone_number}
        onChange={inputChangeHandler}
        error={errors.phone_number || getFieldError('phone_number', createError || updateError)}
      />

      <Input
        name="address"
        placeholder="Адрес"
        value={form.address}
        onChange={inputChangeHandler}
      />

      <Button type="submit" disabled={loading} className="w-full mt-3">
        {counterparty ? 'Сохранить' : 'Создать'}
        {loading ? <LoaderCircle className="animate-spin mr-2 h-4 w-4" /> : null}
      </Button>
    </form>
  )
}

export default CounterpartyForm
