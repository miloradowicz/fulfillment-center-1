import { FC, PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks.ts'
import { selectUser } from '@/store/slices/authSlice.ts'
import { featureProtection } from '@/constants'

interface Props extends PropsWithChildren {
  allowedRoles: string[]
}

const AllowedRoute: FC<Props> = ({ allowedRoles, children }) => {
  const navigate = useNavigate()
  const user = useAppSelector(selectUser)

  useEffect(() => {
    if (featureProtection && user && !allowedRoles.includes(user.role)) {
      navigate('/login')
    }
  }, [user, allowedRoles, navigate])

  if (featureProtection && (!user || !allowedRoles.includes(user.role))) {
    return null
  }

  return <>{children}</>
}

export default AllowedRoute
