import { Grid2 as Grid, Skeleton, Typography } from '@mui/material'
import { FC } from 'react'

interface Props {
  label: string,
  value?: string | number | null,
  loading: boolean
}

const ArrivalDetailsTextItem: FC<Props> = ({ label, value, loading }) => {
  return value && <Grid container>
    <Grid size={6}>
      <Typography variant='body2' color='text.secondary'>
        {label}
      </Typography>
    </Grid>
    <Grid size={6}>
      {
        !loading
          ? <Typography variant="body2">{value}</Typography>
          : <Skeleton variant='rectangular' width={200} height='1em' />
      }
    </Grid>
  </Grid>
}

export default ArrivalDetailsTextItem
