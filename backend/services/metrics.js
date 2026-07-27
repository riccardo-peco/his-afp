import client from 'prom-client';

// Registro di default (CPU, Memory, ecc.)
client.collectDefaultMetrics();

// 1. Istogramma per la durata delle richieste HTTP
export const httpRequestDurationMicroseconds = new client.Histogram({
	name: 'http_request_duration_seconds',
	help: 'Duration of HTTP requests in seconds',
	labelNames: ['method', 'route', 'code'],
	buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10]
});

// 2. Contatore per gli Errori (NUOVO)
export const errorCounter = new client.Counter({
	name: 'app_errors_total',
	help: 'Count of all application errors',
	labelNames: ['type', 'code', 'route'] // Es. type='db_error', code='500'
});

// Funzione helper per esporre le metriche
export const getMetrics = async () => {
	return await client.register.metrics();
};

export const getContentType = () => {
	return client.register.contentType;
};
