import { Box } from '@mui/material'
import StockProductsDataList from '../components/StockProductsDataList'
import { Stock } from '@/types'

const StockProductsPage = () => {
  return (
    <Box>
      <StockProductsDataList selector={(stock: Stock) => stock.products ?? []}/>
    </Box>
  )
}

export default StockProductsPage
