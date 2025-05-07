import React from 'react'
import { useRegistrationForm } from '../hooks/useRegistrationForm'
import { roles } from '@/constants'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LoaderCircle } from 'lucide-react'
import { UserUpdateMutation } from '@/types'
import { InputWithError } from '@/components/ui/input-with-error.tsx'

interface RegistrationFormProps {
  onSuccess: () => void
  initialFormData?: Partial<UserUpdateMutation>
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess, initialFormData }) => {
  const {
    sending,
    backendError,
    form,
    confirmPassword,
    onSubmit,
    handleConfirmPasswordChange,
    handleChange,
    validateFields,
    getFieldError,
    isFormValid,
    isEditMode,
    handleBlur,
  } = useRegistrationForm(onSuccess, initialFormData)

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-md sm:text-2xl font-semibold text-center">
        {isEditMode ? 'Редактировать пользователя' : 'Добавить нового сотрудника'}
      </h3>

      <InputWithError
        id="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        onBlur={e => {
          handleBlur('email', e.target.value)
          validateFields('email')
        }}
        error={getFieldError('email')}
      />

      <InputWithError
        id="displayName"
        name="displayName"
        placeholder="Отображаемое имя"
        value={form.displayName}
        onChange={handleChange}
        onBlur={e => handleBlur('displayName', e.target.value)}
        error={getFieldError('displayName')}
      />

      <InputWithError
        id="password"
        name="password"
        placeholder={isEditMode ? 'Новый пароль (необязательно)' : 'Пароль'}
        type="password"
        value={form.password}
        onChange={handleChange}
        onBlur={e => {
          if (!isEditMode) {
            handleBlur('password', e.target.value)
          }
        }}
        error={getFieldError('password')}
      />

      <InputWithError
        id="confirmPassword"
        name="confirmPassword"
        placeholder="Подтвердите пароль"
        type="password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        onBlur={() => {
          if (!isEditMode) {
            handleBlur('confirmPassword', confirmPassword)
          }
          validateFields('confirmPassword')
        }}
        error={getFieldError('confirmPassword')}
      />

      <Select
        value={form.role}
        onValueChange={(value: string) => {
          handleChange({ target: { name: 'role', value } } as React.ChangeEvent<HTMLInputElement>)
          validateFields('role')
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Выберите роль" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role, i) => (
            <SelectItem key={i} value={role.name}>
              {role.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {getFieldError('role') && (
        <p className="text-sm text-destructive mt-1">{getFieldError('role')}</p>
      )}

      <Button
        type="submit"
        className="w-full mt-3"
        disabled={
          (!!backendError && !!Object.keys(backendError.errors).length) ||
          !isFormValid() ||
          sending
        }
      >
        {sending ? <LoaderCircle className="animate-spin h-4 w-4 mr-2" /> : null}
        {isEditMode ? 'Сохранить изменения' : 'Создать пользователя'}
      </Button>
    </form>
  )
}

export default RegistrationForm
