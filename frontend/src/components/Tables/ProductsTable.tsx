import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { ProductArrivalWithPopulate, ProductForOrderForm } from '../../types'
import React from 'react'

interface Props {
  products: ProductForOrderForm[] | ProductArrivalWithPopulate[] | []
}

const ProductsTable: React.FC<Props> = ({ products }) => {
  return (
    <TableContainer>
      <Table  size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '40%' }}>Наименование</TableCell>
            <TableCell align="center" sx={{ width: '10%' }}>Количество</TableCell>
            <TableCell align="center" sx={{ width: '25%' }}>Штрихкод</TableCell>
            <TableCell align="center" sx={{ width: '25%' }}>Артикул</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((item, index) => (
            <TableRow key={`${ item.product._id }-${ index }`}>
              <TableCell component="th" scope="row" className="!border-0">
                {item.product.title}
              </TableCell>
              <TableCell align="center" className="!border-0">{item.amount}</TableCell>
              <TableCell align="center" className="!border-0">{item.product.barcode}</TableCell>
              <TableCell align="center" className="!border-0">{item.product.article}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default ProductsTable
