import { Router } from 'express'
import { LoginController } from '../controllers/login-controller.js'

const loginController = new LoginController()

const loginRouter = Router()

loginRouter.post('/', loginController.login)

export default loginRouter
