import StockDefectsDataList from '../components/StockDefectsDataList.tsx'
import { Stock } from '@/types.js'

const StockDefectsPage = () => {
  return (
    <div>
      <StockDefectsDataList selector={(stock: Stock) => stock.defects ?? []}/>
    </div>
  )
}

export default StockDefectsPage
