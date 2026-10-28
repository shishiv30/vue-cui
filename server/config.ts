import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'production') {
	dotenv.config({ path: path.join(__dirname, '../.env.production'), override: false });
} else if (NODE_ENV === 'stage') {
	dotenv.config({ path: path.join(__dirname, '../.env.stage'), override: false });
} else {
	dotenv.config({ path: path.join(__dirname, '../.env'), override: false });
	dotenv.config({ path: path.join(__dirname, '../.env.local'), override: true });
}

const config = {
	sessionSecret: process.env.SESSION_SECRET || '',
	port: parseInt(process.env.PORT || '', 10) || 3000,
	domain: process.env.DOMAIN,
	mode: NODE_ENV,
	geoareaApiDomain: (process.env.GEOAREA_API_DOMAIN || '').replace(/\/$/, ''),
	soaAPIKey: process.env.SOA_API_KEY || '',
	propertyApiDomain: (process.env.PROPERTY_API_DOMAIN || '').replace(/\/$/, ''),
	schoolApiDomain: (process.env.SCHOOL_API_DOMAIN || '').replace(/\/$/, ''),
	userApiDomain: (process.env.USER_API_DOMAIN || '').replace(/\/$/, ''),
	poiApiDomain: (process.env.POI_API_DOMAIN || '').replace(/\/$/, ''),
	webpackMode: process.env.WEBPACK_MODE || NODE_ENV,
	webpackDevtool:
		process.env.WEBPACK_DEVTOOL || (NODE_ENV === 'development' ? 'source-map' : undefined),
	webpackStats:
		process.env.WEBPACK_STATS || (NODE_ENV === 'development' ? 'minimal' : 'errors-only'),
	appName: process.env.APP_NAME || 'Pure',
	appHost:
		process.env.APP_HOST ||
		`http://${process.env.DOMAIN || 'localhost'}:${process.env.PORT || 3000}`,
	cdnHost:
		process.env.CDN_HOST ||
		process.env.APP_HOST ||
		`http://${process.env.DOMAIN || 'localhost'}:${process.env.PORT || 3000}`,
	webpackDevServerUrl: `http://${process.env.WEBPACK_DEV_SERVER_HOST}:${process.env.WEBPACK_DEV_SERVER_PORT}`,
	webpackDevServerPort: parseInt(process.env.WEBPACK_DEV_SERVER_PORT || '', 10) || 3001,
	webpackDevServerHost: process.env.WEBPACK_DEV_SERVER_HOST || 'localhost',
	webpackHotReload: process.env.WEBPACK_HOT_RELOAD === 'true' || NODE_ENV === 'development',
	dockerPort:
		process.env.CDN_HOST ? (parseInt(process.env.DOCKER_PORT || '', 10) || 3002) : undefined,
	webpackMinimize:
		process.env.WEBPACK_MINIMIZE === 'true' ||
		NODE_ENV === 'production' ||
		NODE_ENV === 'stage',
	webpackOptimize:
		process.env.WEBPACK_OPTIMIZE === 'true' ||
		NODE_ENV === 'production' ||
		NODE_ENV === 'stage',
	corsOrigins: [] as string[],
};

config.corsOrigins = [
	config.appHost,
	config.webpackDevServerUrl,
	...(config.dockerPort ? [`http://${config.domain || 'localhost'}:${config.dockerPort}`] : []),
];

console.log('[config] env APP_HOST:', process.env.APP_HOST ?? '(unset)');
console.log('[config] env CDN_HOST:', process.env.CDN_HOST ?? '(unset)');
console.log('[config] resolved appHost:', config.appHost);
console.log('[config] resolved cdnHost:', config.cdnHost);

export default config;
