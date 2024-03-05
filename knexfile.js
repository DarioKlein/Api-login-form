import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: resolve(__dirname, 'src', 'database', 'database.db'),
    },
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb),
    },
    migrations: {
      directory: resolve(__dirname, 'src', 'database', 'knex', 'migrations'),
    },
    useNullAsDefault: true,
  },
}

export default config
