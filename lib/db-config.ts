import mysql from 'mysql2/promise'

// Set this flag to true for production, false for development
const isProduction = false; // Change this flag to switch between environments

interface DbConfig {
  host: string;
  database: string;
  user: string;
  password: string;
}

// Development settings
const devConfig: DbConfig = {
  host: 'localhost',
  database: 'user_management', // Development DB name
  user: 'root',
  password: 'stigstream',
};

// Production settings
const prodConfig: DbConfig = {
  host: 'localhost',
  database: 'stigstre_stigstreamv4',
  user: 'stigstre_main',
  password: 'KsljXN^HhQjP',
};

// Choose configuration based on isProduction flag
const dbConfig = isProduction ? prodConfig : devConfig;

let pool: mysql.Pool;

export async function getConnection() {
  if (!pool) {
    pool = mysql.createPool({
      ...dbConfig,
      connectionLimit: 10,
    });
  }
  return pool.getConnection();
}

export async function query(sql: string, params: any[] = []) {
  const connection = await getConnection();
  try {
    const [results] = await connection.query(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

export default dbConfig;

