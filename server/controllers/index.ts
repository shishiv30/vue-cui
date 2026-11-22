// @ts-nocheck
// Full BaseController config contract: see ./configbase.js
import useragent from 'express-useragent';
import serverConfig from '../config.js';
import geo from './geo.js';
import property from './property.js';
import propertySitemap from './propertySitemap.js';
import propertySitemapState from './propertySitemapState.js';
import propertySitemapCounty from './propertySitemapCounty.js';
import propertySitemapCity from './propertySitemapCity.js';
import { getSoaLogs } from './realestate.js';
const queryGroupKey = ['utm', 'hack'];

const routeConfigs = [
	geo,
	property,
	propertySitemap,
	propertySitemapState,
	propertySitemapCounty,
	propertySitemapCity,
];

export default class BaseController {
	constructor(req, res, name) {
		if (!req) {
			throw new Error('Req is required');
		}
		if (!res) {
			throw new Error('Res is required');
		}
		this.req = req;
		this.res = res;
		this.name = name;
		this.date = new Date();
		this.config = this.getConfig(name);
		if (!this.config) {
			throw new Error('Model Config is required');
		}
		this.initialReq();
	}

	initialReq() {
		if (this.req.headers['user-agent']) {
			this.req.uaData = useragent.parse(this.req.headers['user-agent']);
		}
		// if (this.req.query) {
		// 	this.req.queryData = this._getQueryData(this.req.query);
		// }
	}

	// _getQueryData(query) {
	// 	if (!query) return null;
	// 	let queryData = {};
	// 	for (const key in query) {
	// 		let groupKey = key.split('_')[0];
	// 		let index = queryGroupKey.indexOf(`${groupKey}`);
	// 		if (index > -1) {
	// 			let subGroupKey = key.split('_')[1];
	// 			if (subGroupKey) {
	// 				if (!queryData[groupKey]) {
	// 					queryData[groupKey] = {};
	// 				}
	// 				queryData[groupKey][subGroupKey] = query[key];
	// 			}
	// 		} else {
	// 			queryData[key] = query[key];
	// 		}
	// 	}
	// 	return queryData;
	// }

	getConfig(name) {
		return routeConfigs.find((e) => e.name === name);
	}

	exceptionDataHandler(error, payload) {
		let message, data, code;
		if (this.config.onError) {
			let result = this.config.onError(error, payload);
			message = result?.message;
			data = result?.data;
			code = result?.code;
		}
		return { error: message || error?.message, data: data || null, code: code || 500 };
	}
	initialMeta(model) {
		//get lang from this.req.headers['accept-language'] with format like en-US
		let originMeta = model?.data?.meta || {};
		let lang = this.req.acceptsLanguages();
		let origin = this.req.headers.origin || `${this.req.protocol}://${this.req.get('host')}`;
		const cdnBase = serverConfig.cdnHost || '';
		const assetPath = (path) => (cdnBase ? `${cdnBase}${path}` : path);
		const defaultPreload = [{ as: 'image', href: assetPath('/images/logo-bg.svg') }];
		const pagePreload =
			Array.isArray(originMeta?.preload) && originMeta.preload.length
				? originMeta.preload.map((p) => ({
						as: p.as || 'image',
						href: assetPath(p.href || p.path || ''),
					}))
				: defaultPreload;
		let preload = pagePreload;
		if (this.config.preload) {
			const extra = this.config.preload(this.req, model);
			// Route preload hook must return { href: absolute URL with host }, not path-only
			if (extra && extra.length) preload = preload.concat(extra);
		}
		const assetName = this.config.assetName || this.config.name;
		let meta = {
			...originMeta,
			role: assetName || '',
			uaData: this.req.uaData,
			lang: (lang && lang[0]) || '',
			path: this.req.path,
			origin: origin,
			preload: preload,
			css: assetPath(`/${assetName}.min.css`),
			js: assetPath(`/${assetName}.min.js`),
			pageType: `page-${this.config.name}`,
			cdnHost: cdnBase,
			appHost: serverConfig.appHost,
			appName: serverConfig.appName,
		};
		return meta;
	}

	async post() {
		if (this.config.post) {
			let payload = this.req.body;
			if (this.config.beforePost) {
				payload = this.config.beforePost(this.req, payload);
			}
			try {
				let data = await this.config.post(payload);
				return { code: 200, data: data };
			} catch (error) {
				return this.exceptionDataHandler(error, payload);
			}
		}
	}

	async update() {
		if (this.config.update) {
			let payload = this.req.body;
			if (this.config.beforeUpdate) {
				payload = this.config.beforeUpdate(this.req, payload);
			}
			try {
				let data = await this.config.update(payload);
				return { code: 200, data: data };
			} catch (error) {
				return this.exceptionDataHandler(error, payload);
			}
		}
	}

	async delete() {
		if (this.config.delete) {
			let payload = this.req.body;
			if (this.config.beforeDelete) {
				payload = this.config.beforeDelete(this.req, payload);
			}
			try {
				let data = await this.config.delete(payload);
				return { code: 200, data: data };
			} catch (error) {
				return this.exceptionDataHandler(error, payload);
			}
		}
	}

	async get() {
		let payload = this.req.query;
		if (this.config.beforeGet) {
			payload = this.config.beforeGet(this.req, payload);
		}
		try {
			let data = await this.config.get(payload);
			if (data && typeof data === 'object' && !Array.isArray(data)) {
				data.logs = getSoaLogs();
			}
			return { code: 200, data: data };
		} catch (error) {
			return this.exceptionDataHandler(error, payload);
		}
	}

	async toData(model) {
		let code = model.code || 200;
		model.data.meta = this.initialMeta(model);
		this.res.status(code).json({
			code: code,
			data: model.data,
			error: model.error,
			cost: new Date() - this.date,
		});
	}
}
