import { Box, Skeleton, Typography } from '@mui/material'
import React from 'react'

interface Props {
  loading?: boolean;
  icon?: React.ReactNode;
  label: string;
  value?: string | null;
}

const ClientInfoItem: React.FC<Props> = ({ loading, icon, label, value }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
      {icon && (
        <Box sx={{
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
        }}>
          {icon}
        </Box>
      )}
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        {loading ? (
          <Skeleton variant="text" width={120} />
        ) : (
          <Typography fontWeight={500}>
            <strong>
              {value || '—'}
            </strong>
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default ClientInfoItem
