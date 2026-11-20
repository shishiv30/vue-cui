import { footerData } from './footer.js';
import { headerData } from './header.js';
import { linksData } from './links.js';
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
	const links = linksData(input.links) as LinkRow[];
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
			header: headerData(),
			footer: footerData(),
			links,
		},
	};
}
