import config from '../config.js';

export function pageContext(geo: unknown = null) {
	return {
		metadata: {
			appHost: config.appHost,
			cdnHost: config.cdnHost,
		},
		data: {
			geo,
			user: null as null,
		},
	};
}
