import { getFieldError } from '@/utils/getFieldError.ts'
import { taskType } from '../state/taskState.ts'
import useTaskForm from '../hooks/useTaskForm.ts'
import React from 'react'
import { TaskWithPopulate } from '@/types'
import { InputWithError } from '@/components/ui/input-with-error.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Button } from '@/components/ui/button.tsx'
import { LoaderCircle } from 'lucide-react'
import { CustomSelect } from '@/components/CustomSelect/CustomSelect.tsx'
import { inputChangeHandler } from '@/utils/inputChangeHandler.ts'

interface Props {
  onSuccess?: () => void
  initialData?: TaskWithPopulate
}

const TaskForm: React.FC<Props> = ({ onSuccess, initialData }) => {
  const {
    users,
    form,
    orders,
    arrivals,
    error,
    errors,
    addLoading,
    updateLoading,
    handleSubmit,
    handleBlur,
    setForm,
    activePopover,
    setActivePopover,
  } = useTaskForm(onSuccess, initialData)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-md sm:text-2xl font-semibold text-center">
        {initialData ? 'Редактировать задачу' : 'Добавить новую задачу'}
      </h3>

      <CustomSelect
        value={users?.find(u => u._id === form.user)?.displayName}
        placeholder="Выберите пользователя"
        options={users || []}
        onSelect={userId => {
          setForm(prev => ({ ...prev, user: userId }))
          handleBlur('user', userId)
        }}
        popoverKey="user"
        searchPlaceholder="Поиск пользователя..."
        activePopover={activePopover}
        setActivePopover={setActivePopover}
        error={errors.user || getFieldError('user', error)}
        renderValue={user => user.displayName}
      />

      <InputWithError
        name="title"
        placeholder="Название"
        value={form.title}
        onChange={e => inputChangeHandler(e, setForm)}
        error={errors.title || getFieldError('title', error)}
        onBlur={e => handleBlur('title', e.target.value)}
      />

      <Textarea
        name="description"
        placeholder="Описание задачи"
        value={form.description}
        onChange={e => inputChangeHandler(e, setForm)}
        className="resize-y min-h-[40px] max-h-[200px]"
      />

      <CustomSelect
        value={form.type || ''}
        placeholder="Выберите тип"
        options={taskType.map(t => ({ _id: t, name: t }))}
        onSelect={type => setForm(prev => ({ ...prev, type }))}
        popoverKey="type"
        searchPlaceholder="Поиск типа задачи..."
        activePopover={activePopover}
        setActivePopover={setActivePopover}
        error={errors.type || getFieldError('type', error)}
        renderValue={item => item.name}
      />

      {form.type === 'заказ' && (
        <CustomSelect
          value={orders?.find(o => o._id === form.associated_order)?.orderNumber}
          placeholder="Выберите заказ"
          options={orders || []}
          onSelect={orderId => setForm(prev => ({ ...prev, associated_order: orderId }))}
          popoverKey="order"
          searchPlaceholder="Поиск заказа..."
          activePopover={activePopover}
          setActivePopover={setActivePopover}
          error={errors.associated_order || getFieldError('associated_order', error)}
          renderValue={order => order.orderNumber ?? ''}
        />
      )}

      {form.type === 'поставка' && (
        <CustomSelect
          value={arrivals?.find(a => a._id === form.associated_arrival)?.arrivalNumber}
          placeholder="Выберите поставку"
          options={arrivals || []}
          onSelect={arrivalId => setForm(prev => ({ ...prev, associated_arrival: arrivalId }))}
          popoverKey="arrival"
          searchPlaceholder="Поиск поставки..."
          activePopover={activePopover}
          setActivePopover={setActivePopover}
          error={errors.associated_arrival || getFieldError('associated_arrival', error)}
          renderValue={arrival => arrival.arrivalNumber || ''}
        />
      )}

      <Button type="submit" disabled={addLoading || updateLoading} className="w-full mt-3">
        {initialData ? 'Сохранить' : 'Создать'}
        {addLoading || updateLoading ? <LoaderCircle className="animate-spin mr-2 h-4 w-4" /> : null}
      </Button>
    </form>
  )
}

export default TaskForm
