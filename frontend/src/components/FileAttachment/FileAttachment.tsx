import React from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { File, FileCheck2, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Label } from '@/components/ui/label.tsx'

import { basename } from 'path-browserify'
import { apiHost } from '@/constants'

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
  const hasAnyFiles = existingFiles.length > 0 || files.length > 0

  return (
    <div className="flex flex-col gap-2">
      <Accordion type="single" collapsible defaultValue={hasAnyFiles ? 'item-1' : undefined}>
        <AccordionItem value="item-1">
          <AccordionTrigger className="font-bold mt-0 mb-2.5 p-0">Загруженные файлы</AccordionTrigger>
          {hasAnyFiles && (
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {existingFiles.map((file, index) => (
                  <div key={`existing-${ index }`} className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        to={`${apiHost}/uploads/documents/${ basename(file.document) }`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center gap-2 hover:text-primary min-w-0"
                      >
                        <FileCheck2 className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate text-sm">{basename(file.document)}</span>
                      </Link>

                      {onRemoveExistingFile && (
                        <Button
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={e => {
                            e.preventDefault()
                            onRemoveExistingFile(index)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Separator />
                  </div>
                ))}

                {files.map((file, index) => (
                  <div key={`new-${ index }`} className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCheck2 className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate text-sm">{file.name}</span>
                      </div>

                      {onRemoveFile && (
                        <Button
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={e => {
                            e.preventDefault()
                            onRemoveFile(index)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>

      <div className="space-y-1">
        <Input
          type="file"
          accept=".pdf, .doc, .docx, .xlsx"
          multiple
          onChange={onFileChange}
          id="file-upload"
          className="hidden"
        />
        <Label
          htmlFor="file-upload"
          className="flex items-center gap-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground cursor-pointer hover:bg-accent/50"
        >
          <File className="h-4 w-4" />
          <span className="text-sm">Выберите файл для загрузки</span>
        </Label>
        <p className="text-xs text-muted-foreground">Поддерживаемые форматы: .pdf, .doc, .docx, .xlsx</p>
      </div>
    </div>
  )
}

export default FileAttachments
