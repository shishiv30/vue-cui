// @ts-nocheck
import express from 'express';
import config from '../config.js';
import { fetchFromSoa } from '../controllers/realestate.js';

const router = express.Router();
router.use(express.json());

function sendJson(res, data) {
	res.json(data);
}

function getSchoolApiDomain() {
	if (!config.schoolApiDomain) {
		throw new Error('SCHOOL_API_DOMAIN is not configured');
	}
	return config.schoolApiDomain;
}

function handleSoaError(res, error) {
	console.error('SOA School API error:', error);
	const status =
		error.message === 'SCHOOL_API_DOMAIN is not configured'
			? 503
			: error.message === 'School API path required'
				? 400
				: 500;
	const match = error.message?.match(/: (\d{3}) /);
	const fallbackStatus = match ? Number(match[1]) : status;
	res.status(fallbackStatus).json({ error: error.message || 'Internal server error' });
}

// --- Explicit SOA school routes (order: specific before catch-all) ---

/**
 * @swagger
 * /soa/school/property/locations/{latLng}/assignedSchools:
 *   get:
 *     summary: Get nearby schools by location (lat,lng in one segment, e.g. 40.7,-74.0)
 *     tags:
 *       - SOA School
 */
export async function getSchoolBaseInfo(schoolId, query = {}) {
	const id = schoolId == null ? '' : String(schoolId).trim();
	if (!id) {
		throw new Error('schoolId is required');
	}
	const domain = getSchoolApiDomain();
	return fetchFromSoa(domain, 'GET', '/baseInfo', {
		query: { ...query, id },
	});
}

export async function getNearbySchoolsByLocation(latLng, query = {}) {
	const domain = getSchoolApiDomain();
	const path = `/property/locations/${encodeURIComponent(latLng)}/assignedSchools`;
	return fetchFromSoa(domain, 'GET', path, { query });
}

async function getNearbySchoolsByLocationHandler(req, res) {
	try {
		sendJson(res, await getNearbySchoolsByLocation(req.params.latLng, req.query));
	} catch (error) {
		handleSoaError(res, error);
	}
}

router.get('/property/locations/:latLng/assignedSchools', getNearbySchoolsByLocationHandler);

export default router;
