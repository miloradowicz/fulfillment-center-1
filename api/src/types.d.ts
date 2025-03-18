import { Request } from 'express'
import { User } from './schemas/user.schema'
import { HydratedDocument } from 'mongoose'

export type HydratedUser = HydratedDocument<User>

export type RequestWithUser = Request & { user: HydratedUser }

export type JwtToken = { id: sring }