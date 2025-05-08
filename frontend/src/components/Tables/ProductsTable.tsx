import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DefectWithPopulate, ProductArrivalWithPopulate } from '@/types'
import React from 'react'

interface Props {
  products?: ProductArrivalWithPopulate[]
  defects?: DefectWithPopulate[]
}

const ProductsTable: React.FC<Props> = ({ products, defects }) => {
  const isDefectsTable = defects !== undefined
  const data = defects ?? products

  return data?.length !== 0 ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Наименование</TableHead>
          <TableHead className="font-bold">Количество</TableHead>
          <TableHead className="font-bold">{isDefectsTable ? 'Дефект' : 'Штрихкод'}</TableHead>
          {!isDefectsTable && <TableHead className="font-bold">Артикул</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map(item => (
          <TableRow key={item.product._id}>
            <TableCell className="font-medium">{item.product.title}</TableCell>
            <TableCell>
              {isDefectsTable ? (item as DefectWithPopulate).amount : (item as ProductArrivalWithPopulate).amount}
            </TableCell>
            <TableCell>
              {isDefectsTable
                ? (item as DefectWithPopulate).defect_description
                : (item as ProductArrivalWithPopulate).product.barcode}
            </TableCell>
            {!isDefectsTable && <TableCell>{(item as ProductArrivalWithPopulate).product.article}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <p className="text-sm text-muted-foreground font-bold text-center mt-3">
      {isDefectsTable ? 'Дефекты отсутствуют.' : 'Товары отсутствуют.'}
    </p>
  )
}

export default ProductsTable
