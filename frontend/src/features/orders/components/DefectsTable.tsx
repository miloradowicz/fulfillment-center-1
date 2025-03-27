import React from 'react'
import { DefectForOrderForm } from '../../../types'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'


 interface Props {
  defects: DefectForOrderForm[]
}

const DefectsTable: React.FC<Props> = ({ defects }) => {

  if (defects.length === 0) {
    return (
      <Typography variant="body1" className="text-gray-500">
        Дефекты отсутствуют
      </Typography>
    )
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '40%' }}>Наименование</TableCell>
            <TableCell align="center" sx={{ width: '10%' }}>Количество</TableCell>
            <TableCell align="center" sx={{ width: '50%' }}>Дефект</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {defects.map((defect, index) => (
            <TableRow key={`${ defect.product._id }-${ index }`}>
              <TableCell component="th" scope="row" className="!border-0">
                {defect.product.title}
              </TableCell>
              <TableCell align="center" className="!border-0">{defect.amount}</TableCell>
              <TableCell align="center" className="!border-0">{defect.defect_description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DefectsTable
