import React from 'react'
import { DefectMutation } from '../../../types'
import { Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

 interface Props {
  defects: DefectMutation[];
}

const DefectsTable: React.FC<Props> = ({ defects }) => {
  const defectsColumns = [
    { field: 'productName', headerName: 'Наименование', flex: 0.2 },
    { field: 'defectDescription', headerName: 'Описание дефекта', flex: 0.6 },
    { field: 'amount', headerName: 'Количество', flex: 0.2 },
  ]

  if (defects.length === 0) {
    return (
      <Typography variant="body1" className="text-gray-500">
        Дефекты отсутствуют
      </Typography>
    )
  }

  return (
    <DataGrid
      rows={defects.map((defect, index) => ({
        id: index,
        productName: defect.productName,
        defectDescription: defect.defect_description,
        amount: defect.amount,
      }))}
      columns={defectsColumns}
      pageSizeOptions={[5, 10, 15]}
      disableRowSelectionOnClick
    />
  )
}

export default DefectsTable
