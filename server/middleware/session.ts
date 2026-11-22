// @ts-nocheck
import session from 'express-session';
import createMemoryStore from 'memorystore';
import crypto from 'crypto';
import config from '../config.js';

export default function (app) {
	let secret = config.sessionSecret;
	if (!secret) {
		if (config.mode === 'production' || config.mode === 'stage') {
			throw new Error('SESSION_SECRET is required in production and stage');
		}
		// Dev only: random per process, so sessions reset on restart.
		secret = crypto.randomBytes(32).toString('hex');
	}
	// Bounded store: expired sessions are pruned and the count is capped (default store never evicts).
	const MemoryStore = createMemoryStore(session);
	const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;
	const sess = {
		cookie: { maxAge: SESSION_MAX_AGE_MS },
		secret,
		resave: false,
		saveUninitialized: true,
		store: new MemoryStore({ checkPeriod: 60 * 60 * 1000, max: 10000, ttl: SESSION_MAX_AGE_MS }),
	};
	if (app.get('env') === 'production') {
		app.set('trust proxy', 1); // trust first proxy
		sess.cookie.secure = true; // serve secure cookies
	}

	app.use(session(sess));

	//session middleware of history
	app.use(function (req, res, next) {
		const MAX_VIEW_COUNT = 10;
		if (!req.session.history) {
			req.session.history = [];
		}

		let pathname = req.path;
		//if views more than MAX_VIEW_COUNT
		let views = req.session.history;
		let index = views.findIndex((e) => e.pathname === pathname);
		if (index === -1) {
			if (views.length >= MAX_VIEW_COUNT) {
				views.shift();
			}
			views.push({ pathname: pathname, count: 1 });
		} else {
			//move to index item to end of the queue as it is the most recent
			let temp = views.splice(index, 1)[0];
			temp.count++;
			views.push(temp);
		}
		req.session.history = views;
		if (req.session.viewCount) {
			req.session.viewCount++;
		} else {
			req.session.viewCount = 1;
		}
		if (!req.session.landingPage) {
			req.session.landingPage = req.path;
			req.session.landingUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
		}
		next();
	});
}
