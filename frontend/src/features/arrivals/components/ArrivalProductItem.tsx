import { Card, CardContent, Grid2 as Grid, Typography } from '@mui/material'
import {  DefectWithPopulate, ProductArrivalWithPopulate } from '../../../types'
import { FC } from 'react'

interface Props {
  product: ProductArrivalWithPopulate | DefectWithPopulate
}

const ArrivalProductItem: FC<Props> = ({ product }) => {
  return (
    <Card>
      <CardContent>
        <Grid container direction="column">
          <Grid container>
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary">
              Название
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2">{product.product.title}</Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary">
                  Артикул
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2">{product.product.article}</Typography>
            </Grid>
          </Grid>
          {product.product.dynamic_fields?.length && (
            <Grid container size={12}>
              {product.product.dynamic_fields.map(x => (
                <>
                  <Grid size={6}>
                    <Typography variant="body2" color="text.secondary">
                      {x.label}
                    </Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography>{x.value}</Typography>
                  </Grid>
                </>
              ))}
            </Grid>
          )}
          <Grid container>
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary">
                  Количество
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2">{product.amount}</Typography>
            </Grid>
            {'description' in product && product.description && (
              <>
                <Grid size={6}>
                  <Typography variant="body2" color="text.secondary">
                      Описание
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body2">{product.description}</Typography>
                </Grid>
              </>
            )}
            {'defect_description' in product && product.defect_description && (
              <>
                <Grid size={6}>
                  <Typography variant="body2" color="text.secondary">
                      Описание
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body2">{product.defect_description}</Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ArrivalProductItem
