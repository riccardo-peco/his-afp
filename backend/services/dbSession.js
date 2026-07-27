import pg from 'pg';

const { Pool } = pg;

// Configurazione Database
export const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASS,
	port: 5432,
});

// Impostiamo il search_path su 'sio' per ogni connessione
pool.on('connect', (client) => {
	client.query('SET search_path TO sio, public');
});
