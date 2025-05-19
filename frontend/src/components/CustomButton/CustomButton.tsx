import React from 'react'
import { Button } from '../ui/button'

interface CustomButtonProps {
  text: string
  onClick: () => void
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, onClick }) => {
  const customButtonStyle = [
    'cursor-pointer',
    'inline-flex',
    'gap-2',
    'items-center',
    'font-medium',
    'font-semibold',
  ].join(' ')

  return (
    <Button type="button" className={customButtonStyle} onClick={onClick}>
      {text}
    </Button>
  )
}

export default CustomButton
