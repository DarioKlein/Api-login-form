import { compare } from 'bcrypt'
import sqliteConnection from '../database/sqlite/index.js'
import { AppError } from '../utils/app-error.js'
import { verifyRegex } from '../utils/verify-regex.js'

export class LoginController {
  async login(req, res) {
    try {
      const data = req.body
      verifyRegex(data)
      const { email, password } = data

      if (email && password) {
        const database = await sqliteConnection()
        const user = await database.get('SELECT * FROM users WHERE email = (?)', [email])

        if (user) {
          const isPasswordValid = await compare(password, user.password)

          if (isPasswordValid) {
            const { id } = user
            return res.status(200).json({ id })
          } else {
            throw new AppError('❌ Credenciais inválidas, verifique suas informações! ❌')
          }
        } else {
          throw new AppError('❌ Credenciais inválidas, verifique suas informações! ❌')
        }
      } else {
        throw new AppError('Ambos os campos são obrigatórios!')
      }
    } catch (error) {
      return res.status(400).json(error.message)
    }
  }
}
