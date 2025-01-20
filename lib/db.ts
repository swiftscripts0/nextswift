import mysql from 'mysql2/promise'
import dbConfig from './db-config'

let pool: mysql.Pool

export async function getConnection() {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool.getConnection()
}

export async function query(sql: string, params: any[] = []) {
  const connection = await getConnection()
  try {
    const [results] = await connection.query(sql, params)
    return results
  } finally {
    connection.release()
  }
}

