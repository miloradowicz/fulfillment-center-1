import { Client } from '@/types'
import { useClientForm } from '../hooks/useClientForm.ts'
import { InputWithError } from '@/components/ui/input-with-error.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Loader2 } from 'lucide-react'

const ClientForm = ({ client, onClose }: { client?: Client | null; onClose?: () => void }) => {
  const { form, loadingAdd, loadingUpdate, inputChangeHandler, onSubmit, getFieldError } = useClientForm(client?._id, onClose)

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-md sm:text-2xl font-semibold text-center">
          {client ? 'Редактировать клиента' : 'Добавить нового клиента'}
        </h3>

        <InputWithError
          name="name"
          placeholder="ФИО / Название компании"
          value={form.name}
          onChange={inputChangeHandler}
          error={getFieldError('name')}
        />

        <InputWithError
          name="phone_number"
          placeholder="Номер телефона"
          value={form.phone_number}
          onChange={inputChangeHandler}
          error={getFieldError('phone_number')}
        />

        <InputWithError
          name="email"
          placeholder="Эл. почта"
          value={form.email}
          onChange={inputChangeHandler}
          error={getFieldError('email')}
        />

        <InputWithError
          name="inn"
          placeholder="ИНН"
          value={form.inn}
          onChange={inputChangeHandler}
          error={getFieldError('inn')}
        />

        <Input
          name="address"
          placeholder="Адрес"
          value={form.address}
          onChange={inputChangeHandler}
        />

        <Input
          name="banking_data"
          placeholder="Банковские реквизиты"
          value={form.banking_data}
          onChange={inputChangeHandler}
        />

        <Input
          name="ogrn"
          placeholder="ОГРН"
          value={form.ogrn}
          onChange={inputChangeHandler}
        />

        <Button type="submit" disabled={loadingAdd || loadingUpdate} className="w-full mt-3">
          {client ? 'Сохранить' : 'Создать'}
          {loadingAdd || loadingUpdate ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
        </Button>
      </form>
    </>
  )
}

export default ClientForm
