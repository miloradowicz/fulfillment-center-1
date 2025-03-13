import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, Container, Divider, Grid2 as Grid, IconButton, Typography } from '@mui/material'
import { ArrowBack, EditOutlined, DeleteOutline } from '@mui/icons-material'
import ClientInfoItem from '../../clients/components/ClientInfoItem'
import ArrivalProductItem from '../components/ArrivalProductItem'
import { ExpandMore } from '@mui/icons-material'
import ArrivalDetailsTextItem from '../components/ArrivalDetailsTextItem'
import dayjs from 'dayjs'
import useArrivalDetails from '../../../hooks/useArrivalDetails'

const ArrivalDetails = () => {
  const { arrival, loading, navigateBack, handleDelete, handleEdit } = useArrivalDetails()

  return (
    <Container maxWidth='lg'>
      <Box sx={{ mx: 'auto', p: { xs: 1, md: 3 } }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigateBack()}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" fontWeight={700}>
            Назад
          </Typography>
        </Box>

        {
          !loading && !arrival
            ? <Typography>Поставка не найдена</Typography>
            : <Card
              sx={{
                p: { xs: 2, md: 4 },
                borderRadius: 3,
                boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.2)',
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid>
                    <ClientInfoItem loading={loading} label="Имя клиента" value={arrival?.client?.name || '—'} />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              <ArrivalDetailsTextItem label='Цена' value={arrival?.arrival_price} loading={loading} />
              <ArrivalDetailsTextItem label='Статус' value={arrival?.arrival_status} loading={loading} />
              {arrival?.arrival_date && <ArrivalDetailsTextItem label='Дата поставки' value={dayjs(arrival.arrival_date).format('DD/MM/YYYY')} loading={loading} />}
              <ArrivalDetailsTextItem label='Отправлено' value={arrival?.sent_amount} loading={loading} />

              <Divider sx={{ my: 3 }} />

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore />}>
                  <Typography>Товары</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {arrival?.products?.map((x, i) =>
                      <Grid key={i}>
                        <ArrivalProductItem product={x} loading={loading} />
                      </Grid>)
                    }
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore />}>
                  <Typography>Брак</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {arrival?.defects?.map((x, i) =>
                      <Grid key={i}>
                        <ArrivalProductItem product={x} loading={loading} />
                      </Grid>)
                    }
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore />}>
                  <Typography>Получено</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {arrival?.received_amount?.map((x, i) =>
                      <Grid key={i}>
                        <ArrivalProductItem product={x} loading={loading} />
                      </Grid>)
                    }
                  </Grid>
                </AccordionDetails>
              </Accordion>

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
                  onClick={handleEdit}
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
                  onClick={handleDelete}
                >
                  Удалить
                </Button>
              </Box>
            </Card>
        }
      </Box>
    </Container>
  )
}

export default ArrivalDetails
