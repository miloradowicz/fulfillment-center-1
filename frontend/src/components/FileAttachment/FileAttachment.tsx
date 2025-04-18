import React from 'react'
import Grid from '@mui/material/Grid2'
import { IconButton, Typography, Divider } from '@mui/material'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { Link } from 'react-router-dom'
import { basename } from 'path-browserify'

type ExistingFile = { document: string }

interface FileAttachmentsProps {
  existingFiles?: ExistingFile[]
  onRemoveExistingFile?: (index: number) => void

  files?: File[]
  onRemoveFile?: (index: number) => void

  onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FileAttachments: React.FC<FileAttachmentsProps> = ({
  existingFiles = [],
  onRemoveExistingFile,
  files = [],
  onRemoveFile,
  onFileChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {existingFiles.length > 0 &&
        existingFiles.map((file, index) => (
          <React.Fragment key={`existing-${ index }`}>
            <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Link
                to={`http://localhost:8000/uploads/documents/${ basename(file.document) }`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center gap-1 hover:text-blue-500"
              >
                <InsertDriveFileIcon fontSize="large" color="primary" />
                <Typography variant="caption" className="!text-sm !truncate !w-40">
                  {basename(file.document)}
                </Typography>
              </Link>
              {onRemoveExistingFile && (
                <IconButton size="small" onClick={() => onRemoveExistingFile(index)}>
                  <DeleteForeverIcon fontSize="large" />
                </IconButton>
              )}
            </Grid>
            <Divider sx={{ width: '100%', marginBottom: '10px' }} />
          </React.Fragment>
        ))}

      {files.length > 0 && (
        <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {files.map((file, index) => (
            <Grid key={`new-${ index }`} sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Typography variant="body2">{file.name}</Typography>
              {onRemoveFile && (
                <IconButton style={{ marginLeft: 'auto' }} size="small" onClick={() => onRemoveFile(index)}>
                  <DeleteForeverIcon fontSize="large" />
                </IconButton>
              )}
            </Grid>
          ))}
        </Grid>
      )}

      <Grid style={{ display: 'flex', alignItems: 'center' }}>
        <Typography>Загрузить документ</Typography>
        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton component="label">
            <InsertDriveFileIcon fontSize="large" color="primary" />
            <input
              type="file"
              accept=".pdf, .doc, .docx, .xlsx"
              multiple
              hidden
              onChange={onFileChange}
            />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  )
}

export default FileAttachments
