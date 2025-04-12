import React from 'react'
import { useArrivalsList } from '../hooks/useArrivalsList.ts'
import { ArrivalWithClient } from '@/types'
import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import { NavLink } from 'react-router-dom'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { ruRU } from '@mui/x-data-grid/locales'
import Modal from '@/components/Modal/Modal.tsx'
import ArrivalForm from './ArrivalForm.tsx'
import StatusArrivalCell from './StatusArrivalCell.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'

interface Props {
  onEdit: (data: ArrivalWithClient) => void;
}

const ArrivalsDataList: React.FC<Props> = ({ onEdit }) => {
  const { arrivals, handleArchiveClick, handleConfirmArchive, handleClose, isOpen, archiveModalOpen } = useArrivalsList()
  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'))

  const columns: GridColDef<ArrivalWithClient>[] = [
    {
      field: 'arrivalNumber',
      headerName: 'Номер поставки',
      flex: 1,
      minWidth: isMediumScreen ? 180 : 120,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <NavLink to={`/arrivals/${ row._id }`} className="py-2 px-3 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-150 border border-blue-200 hover:border-blue-300 whitespace-nowrap">
          {row.arrivalNumber}
        </NavLink>
      ),
    },
    {
      field: 'client',
      headerName: 'Клиент',
      flex: 1,
      minWidth: isMediumScreen ? 180 : 120,
      align: 'left',
      headerAlign: 'left',
      valueGetter: (_value, row) => row.client?.name ?? 'Неизвестный клиент',
    },
    {
      field: 'stock',
      headerName: 'Склад',
      flex: 1,
      minWidth: isMediumScreen ? 180 : 120,
      align: 'left',
      headerAlign: 'left',
      valueGetter: (_value, row) => row.stock.name ?? 'Неизвестный склад',
    },
    {
      field: 'arrival_date',
      headerName: 'Дата поставки',
      flex: 1,
      minWidth: isMediumScreen ? 140 : 100,
      align: 'left',
      headerAlign: 'left',
      type: 'date',
      valueGetter: (_value, row) => new Date(row.arrival_date),
      valueFormatter: row => dayjs(row).format('DD.MM.YYYY'),
    },
    {
      field: 'arrival_price',
      headerName: 'Цена доставки',
      flex: 1,
      minWidth: isMediumScreen ? 170 : 140,
      align: 'left',
      headerAlign: 'left',
      type: 'number',
    },
    {
      field: 'arrival_status',
      headerName: 'Статус',
      flex: 1,
      minWidth: isMediumScreen ? 160 : 140,
      align: 'left',
      headerAlign: 'left',
      renderCell: params => <StatusArrivalCell row={params.row} />,
    },
    {
      field: 'Actions',
      headerName: 'Действия',
      flex: 1,
      minWidth: isMediumScreen ? 80 : 80,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <>
          <IconButton onClick={() => onEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleArchiveClick(row._id)}>
            <ClearIcon />
          </IconButton>
        </>
      ),
    },
  ]

  return (
    <Box className="max-w-[1000px] mx-auto w-full">
      {arrivals ? (
        <DataGrid
          getRowId={row => row._id}
          rows={arrivals}
          columns={columns}
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      ) : (
        <Typography className="text-center mt-5">Поставки не найдены.</Typography>
      )}

      <ConfirmationModal
        open={archiveModalOpen}
        entityName="эту поставку"
        actionType="archive"
        onConfirm={handleConfirmArchive}
        onCancel={handleClose}
      />

      <Box className="my-8">
        <Modal handleClose={handleClose} open={isOpen}>
          <ArrivalForm />
        </Modal>
      </Box>
    </Box>
  )
}

export default ArrivalsDataList
