import { Stock } from '@/types'
import StockWriteOffsDataList from '../components/StockWriteOffsDataList'

const StockWriteOffsPage = () => {
  return (
    <div>
      <StockWriteOffsDataList selector={(stock: Stock) => stock.write_offs ?? []}/>
    </div>
  )
}

export default StockWriteOffsPage
