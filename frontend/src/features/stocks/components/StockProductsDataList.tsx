import { ProductStockPopulate, Stock } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader'
import DataTable from '@/components/DataTable/DataTable'
import { useStockDetails } from '../hooks/useStockDetails'
import { FC } from 'react'
import { Box, CircularProgress } from '@mui/material'

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
      cell: ({ row }) => <div>{row.original.amount}</div>,
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
      {
        isLoading
          ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
              <CircularProgress />
            </Box>
          )
          : <div className="max-w-[1000px] mx-auto w-full">
            <DataTable columns={columns} data={stock ? selector(stock) : []} />
          </div>
      }
    </>
  )
}

export default StockProductsDataList
