import StockProductsDataList from '../components/StockProductsDataList'
import { Stock } from '@/types'

const StockProductsPage = () => {
  return (
    <div>
      <StockProductsDataList selector={(stock: Stock) => stock.products ?? []}/>
    </div>
  )
}

export default StockProductsPage
