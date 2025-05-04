import StockProductsDataList from '../components/StockProductsDataList.tsx'
import { Stock } from '@/types.js'

const StockDefectsPage = () => {
  return (
    <div>
      <StockProductsDataList selector={(stock: Stock) => stock.defects ?? []}/>
    </div>
  )
}

export default StockDefectsPage
