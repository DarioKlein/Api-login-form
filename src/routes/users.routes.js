import { Router } from 'express'
import { UsersController } from '../controllers/user-controllers.js'

const usersController = new UsersController()

const usersRouter = Router()

usersRouter.post('/', usersController.create)
usersRouter.put('/:id', usersController.update)
usersRouter.delete('/:id', usersController.delete)
usersRouter.get('/', usersController.show)
usersRouter.get('/:id', usersController.searchId)

export default usersRouter
