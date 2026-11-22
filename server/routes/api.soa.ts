// @ts-nocheck
import express from 'express';
import apiSoaProperty from './api.soa.property.js';
import apiSoaSchool from './api.soa.school.js';
import apiSoaGeoarea from './api.soa.geoarea.js';

const router = express.Router();
router.use(express.json());

// Named routes only. No catch-all proxy: it would expose the server's SOA key to any caller.
router.use('/property', apiSoaProperty);
router.use('/school', apiSoaSchool);
router.use('/', apiSoaGeoarea);

export default router;
