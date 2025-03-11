import React from 'react'

export const inputChangeHandler = <T>(
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setState: React.Dispatch<React.SetStateAction<T>>,
) => {
  const { name, value } = e.target

  setState(prev => ({
    ...prev,
    [name]: value,
  }))
}
