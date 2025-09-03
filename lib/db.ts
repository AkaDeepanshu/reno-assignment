import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  ssl: {
    rejectUnauthorized: false
  }
};

export async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export async function createSchoolsTable() {
  const connection = await getConnection();
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      contact BIGINT NOT NULL,
      image TEXT,
      email_id TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    await connection.execute(createTableQuery);
    console.log('Schools table created or already exists');
    return true;
  } catch (error) {
    console.error('Error creating schools table:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

export async function ensureSchoolsTable() {
  try {
    await createSchoolsTable();
  } catch (error) {
    console.error('Failed to ensure schools table exists:', error);
    throw error;
  }
}
