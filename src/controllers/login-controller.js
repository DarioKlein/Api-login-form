import { compare } from 'bcrypt'
import sqliteConnection from '../database/sqlite/index.js'
import { AppError } from '../utils/app-error.js'
import { verifyRegex } from '../utils/verify-regex.js'

export class LoginController {
  async login(req, res) {
    try {
      const data = req.body

      if (Object.keys(data).length === 0) {
        throw new AppError('Os dados não foram enviados!')
      }

      const { email, password } = data

      if (!email || !password) {
        throw new AppError('Ambos os campos são obrigatórios!')
      }

      verifyRegex(data)

      const database = await sqliteConnection()
      const user = await database.get('SELECT * FROM users WHERE email = (?)', [email])

      if (!user) {
        throw new AppError('❌ Credenciais inválidas, verifique suas informações! ❌')
      }

      const isPasswordValid = await compare(password, user.password)

      if (!isPasswordValid) {
        throw new AppError('❌ Credenciais inválidas, verifique suas informações! ❌')
      }

      const { id } = user
      return res.status(200).json({ id })
    } catch (error) {
      return res.status(400).json(error.message)
    }
  }
}
