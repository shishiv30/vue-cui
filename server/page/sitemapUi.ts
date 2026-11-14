import { createFooterComponent } from '../ejs/comp_footer.js';
import { createHeaderComponent } from '../ejs/comp_header.js';
import { createLinksComponent } from '../ejs/comp_links.js';
import { pageContext } from './pageContext.js';

type LinkRow = { href?: string; text?: string };

export function sitemapUiData(input: {
	title: string;
	description: string;
	breadcrumb: unknown;
	links: LinkRow[];
	extra?: Record<string, unknown>;
}) {
	const context = pageContext(null);
	const links = createLinksComponent(input.links).data as LinkRow[];
	return {
		seo: {
			title: input.title,
			h1: input.title,
			description: input.description,
		},
		httpHead: [] as unknown[],
		metadata: context.metadata,
		data: {
			...context.data,
			...(input.extra || {}),
			title: input.title,
			breadcrumb: input.breadcrumb,
			header: createHeaderComponent().data,
			footer: createFooterComponent().data,
			links,
		},
	};
}
