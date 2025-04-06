import { FC, PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { featureProtection } from '../../constants'

interface Props extends PropsWithChildren {
  isAllowed: boolean;
}

const ProtectedRoute: FC<Props> = ({ isAllowed, children }) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (featureProtection && !isAllowed) {
      navigate('/login')
    }
  })

  return children
}

export default ProtectedRoute
