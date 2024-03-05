import * as sqlite from 'sqlite'
import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

async function sqliteConnection() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = resolve(__filename, '..')
  const database = await sqlite.open({
    filename: resolve(__dirname, '../', 'database.db'),
    driver: sqlite3.Database,
  })
  return database
}

export default sqliteConnection
