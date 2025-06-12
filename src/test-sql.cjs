const sql = require('mssql/msnodesqlv8');

const config = {
  connectionString: 'Driver={ODBC Driver 18 for SQL Server};Server=brsqldw;Database=AX2009DataWarehouse;Authentication=ActiveDirectoryIntegrated; Cubes;Trusted_Connection=Yes;TrustServerCertificate=Yes;'
};

async function testConnection() {
  try {
    console.log('⏳ Connecting to SQL Server...');
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT TOP 1 * FROM sys.tables');
    console.log('✅ Connected. Sample output:', result.recordset);
    await sql.close();
  } catch (err) {
    console.error('❌ SQL connection/query failed:\n' + err.message);
  }
}

testConnection();
