import { FC, PropsWithChildren } from 'react'
import { useAppSelector } from '@/app/hooks.ts'
import { selectUser } from '@/store/slices/authSlice.ts'
import { featureProtection } from '@/constants'

interface Props extends PropsWithChildren {
  allowedRoles: string[]
}

const ProtectedElement: FC<Props> = ({ allowedRoles, children }) => {
  const user = useAppSelector(selectUser)

  if (featureProtection && (!user || !allowedRoles.includes(user.role.toLowerCase()))) {
    return null
  }

  return <>{children}</>
}

export default ProtectedElement
