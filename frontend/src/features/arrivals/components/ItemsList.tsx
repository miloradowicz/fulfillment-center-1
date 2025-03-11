import React from 'react'
import { Defect, ProductArrival } from '../../../types'
import Grid from '@mui/material/Grid2'
import { Button, Divider, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface Props {
  items: ProductArrival[] | Defect[]
  onDelete: (index: number) => void
  getProductNameById: (id: string) => string
}

const ItemsList: React.FC<Props> = ({ items, onDelete, getProductNameById }) => {
  return (
    <>
      {items.map((item, i) => (
        <Grid container key={i} spacing={2} alignItems="center" sx={{ marginBottom: '15px', marginTop: '15px' }}>
          <Grid container direction="column" spacing={2}>
            <Grid style={{ textTransform: 'capitalize' }}>
              <Typography fontWeight="bold">{getProductNameById(item.product)}</Typography>
            </Grid>
            <Grid>
              <Typography variant="body2">Количество: {item.amount}</Typography>
            </Grid>
            <Grid>
              <Button variant="outlined" color="error" onClick={() => onDelete(i)} startIcon={<DeleteIcon />}>
                Удалить
              </Button>
            </Grid>
          </Grid>
          {items.length > 1 ? <Divider sx={{ width: '100%', marginTop: '15px' }} /> : null}
        </Grid>
      ))}
    </>
  )
}

export default ItemsList
