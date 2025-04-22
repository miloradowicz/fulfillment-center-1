import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useLoginForm } from '../hooks/useLoginForm'
import { getFieldError } from '@/utils/getFieldError'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const LoginForm = () => {
  const {
    form,
    handleChange,
    onSubmit,
    isFormValid,
    sending,
    loginError,
    errors,
  } = useLoginForm()

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Вход в систему</h1>
        <p className="text-muted-foreground text-sm">Пожалуйста, войдите, чтобы продолжить</p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="text"
            value={form.email}
            onChange={handleChange}
            disabled={sending}
            className={cn(errors.email || getFieldError('email', loginError) ? 'border-red-500' : '')}
          />
          {(errors.email || getFieldError('email', loginError)) && (
            <p className="text-sm text-red-500 mt-1">
              {errors.email || getFieldError('email', loginError)}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            disabled={sending}
            className={cn(errors.password || getFieldError('password', loginError) ? 'border-red-500' : '')}
          />
          {(errors.password || getFieldError('password', loginError)) && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password || getFieldError('password', loginError)}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={!isFormValid || sending}>
          {sending ? <Loader2 className="animate-spin w-5 h-5" /> : 'Войти'}
        </Button>
      </div>
    </form>
  )
}

export default LoginForm
