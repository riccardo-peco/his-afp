import { pool } from "./dbSession.js";
import { catchAsync } from "../utils/errorHandler.js";

export const retrieveTriageColorsFn = catchAsync(async (req, res) => {
	const query = `
        SELECT code, display_name AS "displayName", priority, hex_value AS "hexValue" 
        FROM triage_colors ORDER BY priority
    `;
	const result = await pool.query(query);

	res.status(200).json({
		status: 'success',
		results: result.rowCount,
		data: result.rows
	});
});

export const retrievePathologiesFn = catchAsync(async (req, res) => {
	const query = `SELECT code, description FROM pathologies ORDER BY code`;
	const result = await pool.query(query);

	res.status(200).json({
		status: 'success',
		results: result.rowCount,
		data: result.rows
	});
});

export const retrieveArrivalModesFn = catchAsync(async (req, res) => {
	const query = `SELECT code, description FROM arrival_modes ORDER BY code`;
	const result = await pool.query(query);

	res.status(200).json({
		status: 'success',
		results: result.rowCount,
		data: result.rows
	});
});
