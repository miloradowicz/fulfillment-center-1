import { Request } from 'express'
import { User } from './schemas/user.schema'
import { HydratedDocument } from 'mongoose'

export type RequestWithUser = Request & { user: HydratedDocument<User> }

export type JwtToken = { id: sring }