/**
 * Header nav link table: id, text, path (without domain), order, parentId.
 * parentId empty/null = top-level; otherwise id of parent.
 */
export const pagePath = {
	index: 'page/index',
	'ai-trend': 'page/ai-trend',
	human: 'page/human',
};
export default [
	{ id: 1, text: 'Document', path: '/', order: 1, parentId: null },
	{ id: 2, text: 'Sitemap', path: '/property', order: 2, parentId: null },
	{ id: 3, text: 'Search', path: '/property/search', order: 3, parentId: null },
];
