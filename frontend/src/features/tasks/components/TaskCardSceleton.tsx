import { Card, CardContent, Skeleton } from '@mui/material'

const TaskCardSkeleton = () => {
  return (
    <Card
      sx={{
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: 2,
        position: 'relative',
      }}
    >
      <CardContent>
        <Skeleton variant="text" animation="wave" width="50%" height={24} sx={{ marginBottom: 1 }} />
        <Skeleton variant="text" animation="wave" width="40%" height={20} sx={{ marginBottom: 1 }} />
        <Skeleton variant="text" animation="wave" width="70%" height={25} sx={{ marginBottom: 1 }} />
        <Skeleton variant="text" animation="wave" width="40%" height={20} sx={{ marginBottom: 1 }} />
        <Skeleton variant="rectangular" animation="wave" width="80%" height={40} sx={{ borderRadius: 2 }} />
      </CardContent>
    </Card>
  )
}

export default TaskCardSkeleton
