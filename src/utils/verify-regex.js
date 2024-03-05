import { AppError } from './app-error.js'

export function verifyRegex({ name, email, password }) {
  const nameRegex = new RegExp(/^(?=.*[a-zA-Z])[a-zA-Z0-9_ ]{3,}$/)
  const passwordRegex = new RegExp('^(?=.*[0-9]).{8,}$')
  const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$')

  if (name && !name.match(nameRegex)) {
    throw new AppError('O nome de usuário não é válido')
  }

  if (password && !password.match(passwordRegex)) {
    throw new AppError('A senha não é válida')
  }

  if (email && !email.match(emailRegex)) {
    throw new AppError('O e-mail não é válido')
  }
}
