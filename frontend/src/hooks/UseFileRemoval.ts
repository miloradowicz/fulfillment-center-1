import { useAppDispatch } from '@/app/hooks'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { AsyncThunkAction } from '@reduxjs/toolkit'
import { RootState } from '@/app/store.ts'
import { GlobalError } from '@/types'

type FileItem = {
  document: string
}

type DeleteFileAction = (
  fileName: string
) => AsyncThunkAction<string, string, { state: RootState; rejectValue: GlobalError }>

export const useFileDeleteWithModal = (
  initialFiles: FileItem[] = [],
  deleteFileAction: DeleteFileAction,
) => {
  const [existingFiles, setExistingFiles] = useState<FileItem[]>(initialFiles)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [fileIndexToRemove, setFileIndexToRemove] = useState<number | null>(null)

  const dispatch = useAppDispatch()

  const handleRemoveExistingFile = (indexToRemove: number) => {
    setFileIndexToRemove(indexToRemove)
    setOpenDeleteModal(true)
  }

  const handleModalConfirm = async () => {
    if (fileIndexToRemove === null) return
    const fileToDelete = existingFiles[fileIndexToRemove]
    const fileName = fileToDelete.document.split('/').pop()
    if (!fileName) return

    try {
      await dispatch(deleteFileAction(fileName)).unwrap()
      toast.success(`Вы удалили ${ fileName }`)
      setExistingFiles(prev => prev.filter((_, index) => index !== fileIndexToRemove))
    } catch (err) {
      const errorMessage =
        typeof err === 'object' && err && 'message' in err
          ? (err as GlobalError).message
          : 'Ошибка при удалении файла'

      toast.error(errorMessage)
    } finally {
      setOpenDeleteModal(false)
      setFileIndexToRemove(null)
    }
  }

  const handleModalCancel = () => {
    setOpenDeleteModal(false)
    setFileIndexToRemove(null)
  }

  return {
    existingFiles,
    setExistingFiles,
    openDeleteModal,
    setOpenDeleteModal,
    fileIndexToRemove,
    setFileIndexToRemove,
    handleRemoveExistingFile,
    handleModalConfirm,
    handleModalCancel,
  }
}
