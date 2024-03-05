import { Router } from 'express'
import usersRouter from './users.routes.js'
import loginRouter from './login.routes.js'

export const routes = Router()

routes.use('/users', usersRouter)
routes.use('/login', loginRouter)
