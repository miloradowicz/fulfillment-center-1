import { Box, Button, Card, CircularProgress, Divider, IconButton, Typography } from '@mui/material'
import { ArrowBack, DeleteOutline, EditOutlined } from '@mui/icons-material'
import useProductActions from '../hooks/useProductActions.ts'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import ProductForm from '../components/ProductForm.tsx'

const ProductDetails = () => {
  const {
    navigate,
    id,
    product,
    error,
    loading,
    deleteOneProduct,
    open,
    handleClose,
    handleOpen,
    fetchProduct,
  } = useProductActions(false)

  return (
    <>
      <Modal handleClose={handleClose} open={open}>
        <ProductForm
          initialData={product || undefined}
          onSuccess={() => {
            if (id) fetchProduct(id)
            handleClose()
          }}
        />
      </Modal>
      <Box className="max-w-2xl mx-auto p-4 sm:p-8">
        <Box
          sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
          onClick={() => navigate('/products')}
        >
          <IconButton>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" fontWeight={700}>
            Товары
          </Typography>
        </Box>

        {error ? (
          <Box textAlign="center" mt={4}>
            <Typography color="error" variant="body1" textAlign="center">
              Ошибка загрузки данных товара
            </Typography>
          </Box>
        ) : !product ? (
          <Box textAlign="center" mt={4}>
            <Typography variant="body1" textAlign="center">
              Товар не найден
            </Typography>
          </Box>
        ) : (
          <Card
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 3,
              boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Box sx={{ mb: 2 }}>
              {loading ? (
                <CircularProgress />
              ) : (
                <Typography variant="h6" fontWeight={600} className="text-center">
                  {product.client.name}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Card className="!px-20 !py-4 !shadow-none">
              <Typography variant="h5" fontWeight={600}>
                {product.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Артикул:</strong> {product.article}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Штрихкод:</strong> {product.barcode}
              </Typography>

              {product.dynamic_fields.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Характеристики:
                  </Typography>
                  {product.dynamic_fields.map(field => (
                    <Typography key={field.key} variant="body1" color="text.secondary">
                      <strong>{field.label}:</strong> {field.value}
                    </Typography>
                  ))}
                </Box>
              )}
            </Card>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<EditOutlined />}
                sx={{
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                }}
                onClick={() => handleOpen()}
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
                onClick={() => deleteOneProduct(product._id)}
              >
                Удалить
              </Button>
            </Box>
          </Card>
        )}
      </Box>
    </>
  )
}

export default ProductDetails
