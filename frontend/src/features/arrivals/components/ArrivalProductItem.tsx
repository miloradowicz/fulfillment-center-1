import { Card, CardContent, Grid2 as Grid } from '@mui/material'
import { DefectWithPopulate, ProductArrivalWithPopulate } from '../../../types'
import { FC } from 'react'
import ArrivalDetailsTextItem from './ArrivalDetailsTextItem'

interface Props {
  product: ProductArrivalWithPopulate | DefectWithPopulate
  loading: boolean
}

const ArrivalProductItem: FC<Props> = ({ product, loading }) => {
  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>
        <Grid container direction="column">
          <Grid>
            <ArrivalDetailsTextItem label='Название' value={product.product.title} loading={loading} />
          </Grid>
          <Grid>
            <ArrivalDetailsTextItem label='Артикул' value={product.product.article} loading={loading} />
          </Grid>
          {product.product.dynamic_fields &&
            product.product.dynamic_fields.map(x => (
              <Grid key={x.key}>
                <ArrivalDetailsTextItem label={x.label} value={x.value} loading={loading} />
              </Grid>
            ))
          }
          <Grid>
            <ArrivalDetailsTextItem label='Количество' value={product.amount} loading={loading} />
          </Grid>
          {'description' in product && product.description &&
            <Grid>
              <ArrivalDetailsTextItem label='Описание' value={product.description} loading={loading} />
            </Grid>
          }
          {'defect_description' in product && product.defect_description && (
            <Grid>
              <ArrivalDetailsTextItem label='Описание дефекта' value={product.defect_description} loading={loading} />
            </Grid>
          )}
        </Grid >
      </CardContent >
    </Card >
  )
}

export default ArrivalProductItem
