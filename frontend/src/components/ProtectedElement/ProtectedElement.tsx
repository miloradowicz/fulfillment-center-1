import { FC, PropsWithChildren } from 'react'
import { useAppSelector } from '@/app/hooks.ts'
import { selectUser } from '@/store/slices/authSlice.ts'

interface Props extends PropsWithChildren {
  allowedRoles: string[]
}

const ProtectedElement: FC<Props> = ({ allowedRoles, children }) => {
  const user = useAppSelector(selectUser)

  if (!user || !allowedRoles.includes(user.role.toLowerCase())) {
    return null
  }

  return <>{children}</>
}

export default ProtectedElement
