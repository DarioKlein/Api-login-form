import { hash, compare } from 'bcrypt'
import sqliteConnection from '../database/sqlite/index.js'
import { AppError } from '../utils/app-error.js'
import { verifyRegex } from '../utils/verify-regex.js'
import { isValidUrl } from '../utils/validator-url.js'

export class UsersController {
  async create(req, res) {
    try {
      const data = req.body

      if (Object.keys(data).length > 0) {
        const { name, email, password } = data

        if (name && email && password) {
          const database = await sqliteConnection()
          const checkUserExist = await database.get('SELECT * FROM users WHERE email = (?)', [email])

          if (checkUserExist) {
            throw new AppError('Este e-mail já está em uso, digite outro')
          }

          verifyRegex(data)
          const hashedPassword = await hash(password, 8)

          await database.run('INSERT INTO users (name, email, password) values(?, ?, ?)', [name, email, hashedPassword])

          return res.status(201).json()
        } else {
          throw new AppError('Os dados enviados estão incorretos!')
        }
      } else {
        throw new AppError('Os dados não foram enviados!')
      }
    } catch (error) {
      return res.status(400).json(error.message)
    }
  }

  async show(req, res) {
    try {
      const queryParams = req.query
      const database = await sqliteConnection()

      if (Object.keys(queryParams).length > 0) {
        const { search } = queryParams

        if (search) {
          const usersSearched = await database.all('SELECT * FROM users WHERE name LIKE (?)', `%${search}%`)
          return res.status(200).json(usersSearched)
        } else {
          throw new AppError('Os parâmetros passados estão incorretos')
        }
      } else {
        const users = await database.all('SELECT * FROM users')
        return res.status(200).json(users)
      }
    } catch (error) {
      return res.status(400).json(error.message)
    }
  }

  async update(req, res) {
    try {
      const data = req.body

      if (Object.keys(data).length > 0) {
        const { name, email, password, old_password, description, avatar_url } = data
        const { id } = req.params

        const database = await sqliteConnection()
        const user = await database.get('SELECT * FROM users WHERE id = (?) ', [id])

        if (!user) {
          throw new AppError('Usuário não encontrado!!!')
        }

        const userWithUpdatedEmail = await database.get('SELECT * FROM users WHERE email = (?)', [email])

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
          throw new AppError('Este e-mail já está em uso.')
        }

        if (description && description.length > 255) {
          throw new AppError('A descrição não pode exceder 255 caracteres.')
        }

        if (avatar_url && !isValidUrl(avatar_url)) {
          throw new AppError('A URL do avatar não é válida.')
        }

        verifyRegex(data)

        user.name = name ?? user.name
        user.email = email ?? user.email
        user.avatar_url = avatar_url ?? user.avatar_url
        user.description = description ?? user.description

        if (password && !old_password) {
          throw new AppError('Você precisa informar a antiga senha para poder definir uma senha nova')
        }

        if (password && old_password) {
          const checkOldPassword = await compare(old_password, user.password)

          if (!checkOldPassword) {
            throw new AppError('A senha antiga não confere')
          }

          user.password = await hash(password, 8)
        }

        await database.run(
          `UPDATE users SET
          name = ?,
          email = ?,
          password = ?,
          avatar_url = ?,
          description = ?,
          updated_at = DATETIME('now')
          WHERE id = ?`,
          [user.name, user.email, user.password, user.avatar_url, user.description, id]
        )

        return res.status(200).json()
      } else {
        throw new AppError('Os dados não foram enviados!')
      }
    } catch (error) {
      return res.status(400).json(error.message)
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      const database = await sqliteConnection()
      const user = await database.get('SELECT * FROM users WHERE id = (?) ', [id])

      if (user) {
        await database.run('DELETE FROM users WHERE id = (?)', [id])
      } else {
        throw new AppError('O usuário fornecido não foi encontrado')
      }

      return res.status(204).json()
    } catch (error) {
      return res.status(400).json(error.message)
    }
  }
}
