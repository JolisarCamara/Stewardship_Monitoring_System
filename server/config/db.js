import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER
})

pool.on("connect", () =>{
    console.log("Connected to the database");
})

pool.on("error", (err) =>{
    console.log("Database Connection error", err);
})

export default pool;

