import { ProductStockPopulate, Stock } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader'
import DataTable from '@/components/DataTable/DataTable'
import { useStockDetails } from '../hooks/useStockDetails'
import { FC } from 'react'
import Loader from '@/components/Loader/Loader.tsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AlertTriangle } from 'lucide-react'

interface Props {
  selector: (stock: Stock) => ProductStockPopulate[]
}

const StockProductsDataList: FC<Props> = ({ selector }) => {
  const {
    isLoading,
    stock,
  } = useStockDetails()

  const columns: ColumnDef<ProductStockPopulate>[] = [
    {
      accessorKey: 'client',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Клиент" />,
      meta: {
        title: 'Клиент',
      },
      cell: ({ row }) => <div className="font-medium">{row.original.product.client.name}</div>,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Наименование" />,
      meta: {
        title: 'Наименование',
      },
      cell: ({ row }) => <div>{row.original.product.title}</div>,
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Количество" />,
      meta: {
        title: 'Количество',
      },
      cell: ({ row }) => {
        const amount = row.original.amount
        const isNegative = amount < 0

        return (
          <div className="flex items-center gap-2">
            <span className={isNegative ? 'text-red-500 font-semibold'  : 'text-center ml-2'}>
              {amount}
            </span>
            {isNegative && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertTriangle className="text-red-500 w-4 h-4 mb-auto ml-2" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Количество товара меньше нуля. Проверьте правильность внесения данных поставки и заказов!
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'article',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Артикул" />,
      meta: {
        title: 'Артикул',
      },
      cell: ({ row }) => <div>{row.original.product.article}</div>,
    },
    {
      accessorKey: 'barcode',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Штрих-код" />,
      meta: {
        title: 'Штрих-код',
      },
      cell: ({ row }) => <div>{row.original.product.barcode}</div>,
    },
  ]

  return (
    <>
      {isLoading && <Loader />}

      <div className="max-w-[1000px] mx-auto w-full">
        <DataTable
          columns={columns}
          data={stock ? selector(stock).filter(item => item.amount !== 0) : []}
        />
      </div>
    </>
  )
}

export default StockProductsDataList
