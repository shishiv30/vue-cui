// @ts-nocheck
import { Router } from 'express';
import registerDefault from './default.js';
import registerSitemap from './sitemap.js';
import apiRouter from './api.js';
import apiSoaRouter from './api.soa.js';

const router = Router();
registerDefault(router);
registerSitemap(router);
router.use('/api', apiRouter);
router.use('/api/soa', apiSoaRouter);

export default router;
