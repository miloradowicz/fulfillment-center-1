import { Box, Button, Card, Container, Divider, Grid2 as Grid, IconButton, Typography } from '@mui/material'
import { selectArrivalError, selectArrivalWithPopulate, selectLoadingFetchArrival } from '../../../store/slices/arrivalSlice'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { ArrowBack, EditOutlined, DeleteOutline } from '@mui/icons-material'
import ClientInfoItem from '../../clients/components/ClientInfoItem'
import ArrivalProductItem from '../components/ArrivalProductItem'
import { fetchArrivalByIdWithPopulate } from '../../../store/thunks/arrivalThunk'

const ArrivalDetails = () => {
  const { arrivalId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const arrival = useAppSelector(selectArrivalWithPopulate)
  const loading = useAppSelector(selectLoadingFetchArrival)
  const error = useAppSelector(selectArrivalError)

  useEffect(() => {
    if (arrivalId) {
      dispatch(fetchArrivalByIdWithPopulate(arrivalId))
    }
  }, [dispatch, arrivalId])


  return (
    <Container maxWidth='lg'>
      <Box sx={{ mx: 'auto', p: { xs: 1, md: 3 } }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" fontWeight={700}>
            Назад
          </Typography>
        </Box>

        <Card
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid>
                <ClientInfoItem loading={loading} label="Имя" value={arrival?.client?.name || '—'} />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container>
            {arrival?.products?.map(x =>
              <Grid>
                <ArrivalProductItem product={x} />
              </Grid>)
            }
          </Grid>

          <Box
            sx={{
              mt: 4,
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
            }}
          >
            <Button
              variant="contained"
              startIcon={<EditOutlined />}
              sx={{
                px: 3,
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Редактировать
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteOutline />}
              sx={{
                px: 3,
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Удалить
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  )
}

export default ArrivalDetails
