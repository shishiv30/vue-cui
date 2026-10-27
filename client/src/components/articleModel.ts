export interface ArticleAttr {
	/** Fact label, for example Bd. */
	key?: string;
	/** Fact value. Omitted rows are not rendered. */
	value?: string;
	/** Tooltip on the label. */
	desc?: string;
	/** Extra class on the value cell. */
	className?: string;
}

export interface ArticleTag {
	/** Tag text. Omitted when empty. */
	text?: string;
	/** Extra class on the tag, for example major active. */
	className?: string;
}

/**
 * Card shape used by comp_article.ejs.
 * Same fields mapPropertyToArticle returns for the template.
 */
export interface ArticleUiModel {
	/** Address line. */
	title: string;
	/** Link when set. Otherwise path is used. */
	href?: string;
	/** Path used when href is omitted. */
	path?: string;
	/** Appended as ?id= when present. */
	id?: string;
	/** Photo URL. Empty uses /n_a.svg. */
	img?: string;
	/** Image alt text. */
	imgAlt?: string;
	/** Caption over the photo. */
	imgTag?: string;
	/** Key/value facts. */
	attrs?: ArticleAttr[];
	/** Status chips. */
	tags?: ArticleTag[];
	/** Extra classes on the card, for example default. */
	className?: string;
}

export const articleMock: ArticleUiModel = {
	title: '1200 Main St',
	path: '/property/detail/tx/78701/1',
	img: 'https://picsum.photos/800/600?random=1',
	imgAlt: '1200 Main St',
	imgTag: 'Sample Office',
	className: '',
	attrs: [
		{ key: 'Est', value: '$450,000', desc: 'Estimate Price' },
		{ key: 'Bd', value: '3', desc: 'Bedrooms' },
		{ key: 'Ba', value: '2', desc: 'Bathrooms' },
	],
	tags: [{ className: 'major active', text: 'For Sale' }],
};
