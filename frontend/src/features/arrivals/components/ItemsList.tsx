import { Defect, ProductArrival, ServiceArrival } from '../../../types'
import Grid from '@mui/material/Grid2'
import { Button, Divider, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

type Item = ProductArrival | Defect | ServiceArrival

interface Props<T extends Item> {
  items: T[]
  onDelete: (index: number) => void
  getNameById?: (id: string) => string
}

function isDefect(item: Item): item is Defect {
  return 'product' in item && 'defect_description' in item
}

function isProduct(item: Item): item is ProductArrival {
  return 'product' in item && 'description' in item
}

function isService(item: Item): item is ServiceArrival {
  return 'service' in item
}

const ItemsList = <T extends Item>({ items, onDelete, getNameById }: Props<T>) => {
  return (
    <>
      {items.map((item, i) => (
        <Grid
          container
          key={i}
          spacing={2}
          alignItems="center"
          sx={{ marginBottom: '15px', marginTop: '15px' }}
        >
          <Grid container direction="column" spacing={2}>
            <Grid style={{ textTransform: 'capitalize' }}>
              <Typography fontWeight="bold">
                {isDefect(item) || isProduct(item)
                  ? getNameById?.(item.product)
                  : isService(item)
                    ? getNameById?.(item.service)
                    : ''}
              </Typography>
            </Grid>

            <Grid>
              <Typography variant="body2">
                {isDefect(item) || isProduct(item)
                  ? `Количество: ${ item.amount }`
                  : isService(item)
                    ? `Количество: ${ item.service_amount }`
                    : ''}
              </Typography>
            </Grid>

            {isDefect(item) && (
              <Grid>
                <Typography variant="body2" color="error">
                  Дефект: {item.defect_description}
                </Typography>
              </Grid>
            )}

            {isService(item) && (
              <Grid>
                <Typography variant="body2">
                  {item.service_price ? `Цена услуги: ${ item.service_price }` : null}
                </Typography>
              </Grid>
            )}

            <Grid>
              <Button
                variant="outlined"
                color="error"
                onClick={() => onDelete(i)}
                startIcon={<DeleteIcon />}
              >
                Удалить
              </Button>
            </Grid>
          </Grid>

          {items.length > 1 ? (
            <Divider sx={{ width: '100%', marginTop: '15px' }} />
          ) : null}
        </Grid>
      ))}
    </>
  )
}

export default ItemsList
