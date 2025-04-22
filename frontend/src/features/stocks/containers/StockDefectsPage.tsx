import { Box } from '@mui/material'
import StockProductsDataList from '../components/StockProductsDataList.tsx'
import { Stock } from '@/types.js'

const StockDefectsPage = () => {
  return (
    <Box>
      <StockProductsDataList selector={(stock: Stock) => stock.defects ?? []}/>
    </Box>
  )
}

export default StockDefectsPage
