// Database initialization script
import { createSchoolsTable, getConnection } from '../lib/db.js';

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Test connection
    const connection = await getConnection();
    console.log('✅ Database connection successful');
    await connection.end();
    
    // Create tables
    await createSchoolsTable();
    console.log('✅ Database tables created successfully');
    
    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
