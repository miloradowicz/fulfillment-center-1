import { FC, PropsWithChildren, ReactNode, useRef } from 'react'
import { FormControl, InputLabel, Select, FormHelperText, SelectProps } from '@mui/material'

interface Props extends PropsWithChildren {
  helperText?: ReactNode;
}

const SelectField: FC<SelectProps & Props> = ({ error, helperText, label, children, ...attributes }) => {
  const id = useRef(crypto.randomUUID())

  return (
    <FormControl fullWidth>
      {label && <InputLabel id={id.current}>{label}</InputLabel>}
      <Select labelId={label ? id.current : undefined} label={label} error={error} {...attributes}>
        {children}
      </Select>
      {error && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default SelectField
