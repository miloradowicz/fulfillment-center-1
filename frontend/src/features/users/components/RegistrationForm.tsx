import React from 'react'
import { useRegistrationForm } from '../hooks/useRegistrationForm'
import { roles } from '@/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface RegistrationFormProps {
  onSuccess: () => void
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
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
  } = useRegistrationForm(onSuccess)

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <h3 className="text-md sm:text-2xl font-semibold text-center">Добавить нового сотрудника</h3>

      <div className="space-y-1">
        <Input
          id="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          onBlur={() => validateFields('email')}
        />
        {getFieldError('email') && (
          <p className="text-sm text-destructive mt-1">{getFieldError('email')}</p>
        )}
      </div>

      <div className="space-y-1">
        <Input
          id="displayName"
          name="displayName"
          placeholder="Отображаемое имя"
          value={form.displayName}
          onChange={handleChange}
        />
        {getFieldError('displayName') && (
          <p className="text-sm text-destructive mt-1">{getFieldError('displayName')}</p>
        )}
      </div>

      <div className=" space-y-1">
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
        />
        {getFieldError('password') && (
          <p className="text-sm text-destructive mt-1">{getFieldError('password')}</p>
        )}
      </div>

      <div className="space-y-1">
        <Input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          onBlur={() => validateFields('confirmPassword')}
        />
        {getFieldError('confirmPassword') && (
          <p className="text-sm text-destructive mt-1">{getFieldError('confirmPassword')}</p>
        )}
      </div>

      <div className="space-y-1">
        <Select
          value={form.role}
          onValueChange={(value: string) => handleChange({ target: { name: 'role', value } } as React.ChangeEvent<HTMLInputElement>)}
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
      </div>


      <Button
        type="submit"
        className="w-full mt-3"
        disabled={
          (!!backendError && !!Object.keys(backendError.errors).length) ||
          !isFormValid() ||
          sending
        }
      >
        {sending ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
        Создать пользователя
      </Button>
    </form>
  )
}

export default RegistrationForm
