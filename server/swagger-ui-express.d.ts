declare module 'swagger-ui-express' {
	import type { RequestHandler } from 'express';
	const swaggerUi: {
		serve: RequestHandler[];
		setup: (spec: unknown) => RequestHandler;
	};
	export default swaggerUi;
}

declare module 'swagger-jsdoc' {
	function swaggerJsdoc(options: unknown): unknown;
	export default swaggerJsdoc;
}
