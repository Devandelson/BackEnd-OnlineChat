import 'dotenv/config';
import mysql from 'mysql2';

const conex = mysql.createConnection(process.env.DATABASE_URL);

export default conex.promise();