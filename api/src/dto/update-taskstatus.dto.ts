import { CreateTaskDto } from './create-task.dto'

export type UpdateTaskStatusDto = Pick<CreateTaskDto, 'status'>