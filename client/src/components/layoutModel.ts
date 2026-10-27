export type LayoutMode = 'default' | 'horizontal' | 'grid' | 'ring';

export interface LayoutFact {
	/** Fact label. */
	key: string;
	/** Fact value. */
	value: string;
}

/** One card in the layout. Empty fields are omitted. */
export interface LayoutArticle {
	/** Extra classes on the article, for example default shadow corner. */
	className?: string;
	/** Icon class, for example icon-graduation-cap. */
	icon?: string;
	/** Photo URL. */
	img?: string;
	/** Title. */
	title?: string;
	/** Line under the title. */
	sub?: string;
	/** Line above the body. */
	sup?: string;
	/** Body paragraphs. */
	body?: string[];
	/** Tag labels. */
	tags?: string[];
	/** Key/value facts. */
	dict?: LayoutFact[];
	/** Footer line. */
	footer?: string;
}

/** Cards from client/pages/layout/index.html. */
export const layoutMock: LayoutArticle[] = [
	{
		className: 'default shadow corner',
		icon: 'icon-graduation-cap',
		img: 'https://picsum.photos/347/329?random=1',
		title: 'Demo Article',
		sub: 'Est. 1985 · Public School',
		sup: 'Education',
		body: [
			'Greenfield Primary serves 600+ students across grades K–6, known for its STEM programme and bilingual curriculum.',
		],
		tags: ['K–6', 'STEM', 'Bilingual', 'Public'],
		dict: [
			{
				key: 'Principal',
				value: 'Dr. Linda Marsh',
			},
			{
				key: 'Enrolment',
				value: '612 students',
			},
			{
				key: 'Rating',
				value: '9.2 / 10',
			},
		],
		footer: 'Created 1 Sep 2026',
	},
	{
		className: 'default shadow corner',
		icon: 'icon-graduation-cap',
		img: 'https://picsum.photos/394/358?random=1',
		title: 'Greenfield Primary School',
		sub: 'Est. 1985 · Public School',
		sup: 'Education',
		body: [
			'Greenfield Primary serves 600+ students across grades K–6, known for its STEM programme and bilingual curriculum.',
		],
		tags: ['K–6', 'STEM', 'Bilingual', 'Public'],
		dict: [
			{
				key: 'Principal',
				value: 'Dr. Linda Marsh',
			},
			{
				key: 'Enrolment',
				value: '612 students',
			},
			{
				key: 'Rating',
				value: '9.2 / 10',
			},
		],
		footer: 'Created 1 Sep 2026',
	},
	{
		className: 'major shadow corner',
		icon: 'icon-cutlery',
		img: 'https://picsum.photos/441/387?random=2',
		title: 'Sakura Izakaya',
		sup: 'Open Now',
		body: [
			'A cosy izakaya tucked in Midtown offering handcrafted ramen, fresh sushi, and a curated sake selection.',
			'Weekend omakase available with 48-hr advance booking. Vegan options available on request.',
		],
		tags: ['Japanese', 'Fusion', 'Sake'],
		footer: 'Updated 11 Sep 2026',
	},
	{
		className: 'minor shadow corner',
		img: 'https://picsum.photos/488/315?random=3',
		title: 'Skyline Penthouse — 3 Bedroom, 2 Bathroom with Panoramic Harbour View, Floor 42',
		sub: 'Harbour District',
		sup: 'For Sale',
		body: [
			'Open-plan living spanning 180 m² with floor-to-ceiling glazing and a wrap-around terrace.',
			'Concierge building with heated pool, gym, and 24-hour security. Two car spaces included.',
			'Vacant and ready to move in immediately. Arrange a private inspection today.',
		],
		dict: [
			{
				key: 'Asking price',
				value: '$4,850,000',
			},
			{
				key: 'Floor area',
				value: '180 m²',
			},
			{
				key: 'Floor',
				value: '42',
			},
			{
				key: 'Agent',
				value: 'Century Realty',
			},
		],
	},
	{
		className: 'danger shadow corner',
		icon: 'icon-hospital-o',
		title: 'Metro General',
		sub: 'Level 1 Trauma Centre · 24/7',
		body: [
			"Metro General is the city's primary trauma centre with 800 beds, cardiac ICU, and a dedicated stroke unit. Current A&E wait: 28 min.",
		],
		tags: ['Trauma L1', 'Cardiac', '24/7'],
		dict: [
			{
				key: 'Beds',
				value: '800',
			},
			{
				key: 'A&E wait',
				value: '~28 min',
			},
			{
				key: 'Phone',
				value: '+1 800 555 0100',
			},
		],
	},
	{
		className: 'safe shadow corner',
		icon: 'icon-laptop',
		img: 'https://picsum.photos/334/344?random=5',
		title: 'ProBook X1 — Clearance',
		sub: 'Refurbished · Grade A',
		sup: '43% off',
		body: [
			'Intel Core i7-12th Gen, 16 GB RAM, 512 GB NVMe SSD. Fully tested with a 12-month warranty. Only 14 units remaining.',
		],
		dict: [
			{
				key: 'Original price',
				value: '$1,299',
			},
			{
				key: 'Sale price',
				value: '$739',
			},
			{
				key: 'Stock',
				value: '14 units',
			},
		],
		footer: 'Created 10 Sep 2026',
	},
	{
		className: 'danger shadow corner',
		icon: 'icon-institution',
		title:
			'Scheduled Water Main Maintenance — Temporary Supply Interruption Affecting Zones 4, 7 and 9 This Saturday',
		sup: 'Official Notice',
		body: [
			'Maintenance will interrupt water supply from 02:00–06:00 on Saturday 14 September. Residents are advised to store sufficient water in advance.',
			'Tanker trucks will be stationed at Maple Park and Central Square throughout the maintenance window for emergency supply.',
		],
		tags: ['Official', 'Zone 4', 'Zone 7', 'Zone 9', 'Water'],
		footer: 'Updated 12 Sep 2026, 06:30',
	},
	{
		className: 'tip shadow corner',
		img: 'https://picsum.photos/381/373?random=7',
		title: 'Coastal Storm',
		sub: 'National Weather Service',
		sup: 'Weather Alert',
		body: [
			'A low-pressure system brings heavy rain and wind gusts up to 80 km/h along the coast this Saturday. Inland areas can expect overcast skies with light showers.',
		],
		tags: ['Storm', '80 km/h', 'Weekend'],
	},
	{
		className: 'major shadow corner',
		icon: 'icon-trophy',
		img: 'https://picsum.photos/428/301?random=8',
		title: 'City Marathon 2026 — Full, Half & 10 km Categories Now Open for Registration',
		sub: 'Annual · Downtown Circuit',
		body: [
			"The city's premier marathon returns with 8,000 participant spots. Early-bird registration ends 30 September.",
			'Pace setters provided for 4:00, 4:30, 5:00, and 6:00 finish times. Medical stations every 5 km.',
			'Finishers receive a commemorative medal and a post-race recovery pack. Charity fundraising option available at checkout.',
		],
		dict: [
			{
				key: 'Date',
				value: '15 Nov 2026',
			},
			{
				key: 'Spots remaining',
				value: '2,340 / 8,000',
			},
			{
				key: 'Entry fee',
				value: 'From $45',
			},
		],
		footer: 'Updated 9 Sep 2026',
	},
	{
		className: 'minor shadow corner',
		img: 'https://picsum.photos/475/330?random=9',
		title: 'Void Frontier — Open World RPG',
		body: [
			'Explore a 200-hour hand-crafted universe with branching storylines, dynamic faction politics, and fully destructible environments. Multiplayer co-op up to 4 players.',
		],
		tags: ['RPG', 'Open world', 'Co-op', 'Award winner'],
		dict: [
			{
				key: 'Developer',
				value: 'Helion Studios',
			},
			{
				key: 'Rating',
				value: '93 / 100 Metacritic',
			},
			{
				key: 'Price',
				value: '$59.99',
			},
		],
	},
	{
		className: 'default shadow corner',
		icon: 'icon-sticky-note-o',
		title: 'Sprint Goals',
		sup: 'Draft',
		body: [
			'Finish the article component SCSS, write the layout page HTML, register the webpack entry. Review the list-view PR before EOD.',
		],
		footer: 'Created 12 Sep 2026, 09:14',
	},
	{
		className: 'safe shadow corner',
		icon: 'icon-camera',
		img: 'https://picsum.photos/321/359?random=11',
		title: 'Alps Trip — July 2026',
		sub: 'Personal Album · 214 photos',
		sup: 'Memory',
		body: [
			'Three weeks across Swiss and Austrian Alps. Highlights: Jungfraujoch sunrise and Hallstatt village at golden hour.',
			'Spontaneous fondue with strangers at a mountain hut above 2,400 m — the unexpected highlight of the trip.',
		],
		tags: ['Alps', 'Travel', 'Hiking', 'Summer'],
	},
	{
		className: 'tip shadow corner',
		img: 'https://picsum.photos/368/388?random=12',
		title: 'Kyoto in Autumn',
		sub: 'Japan · Nov–Dec',
		body: [
			"Kyoto's maple season transforms temples and bamboo groves into a fiery canvas of red and gold. Visit Arashiyama at dawn for crowd-free lantern reflections on the Oi River.",
		],
		dict: [
			{
				key: 'Best months',
				value: 'Nov – early Dec',
			},
			{
				key: 'Avg temp',
				value: '8–16°C',
			},
			{
				key: 'Flight from JFK',
				value: '~14 hrs',
			},
		],
		footer: 'Updated 5 Aug 2026',
	},
	{
		className: 'major shadow corner',
		icon: 'icon-briefcase',
		img: 'https://picsum.photos/415/316?random=13',
		title: 'Senior Frontend Engineer — Remote-first · Full-time · Component Library Lead',
		sup: 'Hiring Now',
		body: [
			"We're looking for a frontend engineer with 5+ years in TypeScript, React, and design systems to lead our component library effort.",
			"You'll mentor two junior engineers and collaborate closely with Product and Design to define the next generation of our UI.",
		],
		tags: ['TypeScript', 'React', 'Remote', 'Senior'],
		dict: [
			{
				key: 'Salary',
				value: '$130k–$160k',
			},
			{
				key: 'Deadline',
				value: '30 Sep 2026',
			},
		],
	},
	{
		className: 'safe shadow corner',
		img: 'https://picsum.photos/462/345?random=14',
		title: 'Brown Butter Pasta',
		sub: 'Italian · 20 min',
		sup: 'Quick & Easy',
		body: [
			'Silky spaghetti tossed in nutty brown butter, zesty lemon, crispy capers, and a snowfall of Parmesan. Ready in 20 minutes from pantry staples.',
		],
		tags: ['Pasta', 'Vegetarian', '20 min'],
		footer: 'Created 3 Jul 2026',
	},
	{
		className: 'minor shadow corner',
		icon: 'icon-film',
		title: 'Echoes of Tomorrow — A Time-Loop Thriller That Finally Earns Its Runtime',
		sub: 'Sci-Fi Drama · 2026 · 138 min',
		body: [
			'Director Naomi Asante delivers a quiet, devastating meditation on regret and memory.',
			'Anchored by a career-best performance from Idris Elba, the film trusts silence where lesser sci-fi reaches for spectacle.',
			"The third act's structural gambit pays off in a way that rewards attentive viewers — bring a notepad for the first watch.",
		],
		dict: [
			{
				key: 'Director',
				value: 'Naomi Asante',
			},
			{
				key: 'Runtime',
				value: '138 min',
			},
			{
				key: 'Rotten Tomatoes',
				value: '94%',
			},
			{
				key: 'Verdict',
				value: '★ 4.5 / 5',
			},
		],
	},
	{
		className: 'tip shadow corner',
		icon: 'icon-music',
		img: 'https://picsum.photos/308/374?random=16',
		title: 'Neon Drift',
		sub: 'Synthwave · 12 tracks',
		sup: 'Out Now',
		body: [
			'SOLÁR\'s third studio album blends 80s synth textures with modern production clarity. Stand-out track "Meridian" is an eight-minute instrumental suite that rewards headphones.',
		],
		footer: 'Updated 8 Sep 2026',
	},
	{
		className: 'default shadow corner',
		img: 'https://picsum.photos/355/302?random=17',
		title: 'The Cartography of Loss',
		sup: 'Booker Prize Shortlist',
		body: [
			'A fragmented novel told through handwritten maps, letters, and footnotes, tracking three generations of a Congolese family across colonial and post-colonial history.',
			"Amara Diallo's prose moves between languages and centuries without losing intimacy — a structural feat as impressive as its emotional one.",
		],
		tags: ['Literary fiction', 'History', 'Africa', 'Shortlisted'],
		dict: [
			{
				key: 'Author',
				value: 'Amara Diallo',
			},
			{
				key: 'Publisher',
				value: 'Faber & Faber',
			},
			{
				key: 'Pages',
				value: '348',
			},
		],
	},
	{
		className: 'major shadow corner',
		icon: 'icon-heartbeat',
		title: 'HIIT & Strength',
		sub: 'Studio Apex · 06:30 MWF',
		body: [
			'45-min high-intensity intervals followed by a 15-min progressive strength circuit. All levels welcome. Bring water and a sweat towel.',
		],
		tags: ['HIIT', 'Morning', '3 spots left'],
		footer: 'Created 1 Sep 2026',
	},
	{
		className: 'safe shadow corner',
		img: 'https://picsum.photos/402/331?random=19',
		title: 'Data Engineering with dbt & Snowflake — 40-Hour Self-Paced Certificate',
		sub: 'Online · Intermediate',
		sup: 'Bestseller',
		body: [
			'Covers the modern data stack end-to-end: Snowflake warehousing, dbt transformations, Airflow orchestration, and data quality testing with 4,200 students already enrolled.',
		],
		dict: [
			{
				key: 'Hours',
				value: '40 hrs',
			},
			{
				key: 'Price',
				value: '$89',
			},
			{
				key: 'Certificate',
				value: 'Yes',
			},
		],
	},
	{
		className: 'minor shadow corner',
		img: 'https://picsum.photos/449/360?random=20',
		title: '1,000-Qubit Milestone',
		body: [
			'A research consortium announced stable operation of a 1,000-logical-qubit processor at room temperature — a threshold many considered a decade away.',
			'Peer review is ongoing; independent replication is expected to take 6–18 months.',
		],
		tags: ['Quantum', 'Hardware', 'Milestone'],
		footer: 'Updated 12 Sep 2026, 07:00',
	},
	{
		className: 'tip shadow corner',
		icon: 'icon-shopping-bag',
		title: 'Autumn / Winter Sale',
		sup: 'Up to 60% off',
		body: [
			'End-of-season clearance across outerwear, knitwear, and accessories at Velour Maison. Free shipping on orders over $80. Ends Sunday midnight — no code required.',
		],
		footer: 'Created 8 Sep 2026',
	},
	{
		className: 'major shadow corner',
		img: 'https://picsum.photos/496/389?random=22',
		title:
			'2024 Tesla Model 3 LR AWD — Midnight Silver, 12,400 km, Full Service History, Certified Pre-owned',
		sub: 'Pre-owned · Single owner',
		sup: 'Certified',
		body: [
			'560 km range (WLTP). Enhanced Autopilot included with eight-year battery warranty remaining.',
			'Home charging kit, floor mats, and two key cards included. No accidents on record.',
			'Finance available from $389/month over 60 months with 10% deposit. Delivery available nationwide.',
		],
		tags: ['EV', 'Autopilot', 'AWD'],
		dict: [
			{
				key: 'Price',
				value: '$38,500',
			},
			{
				key: 'Mileage',
				value: '12,400 km',
			},
			{
				key: 'Range',
				value: '560 km WLTP',
			},
			{
				key: 'Finance',
				value: 'From $389/mo',
			},
		],
	},
	{
		className: 'minor shadow corner',
		img: 'https://picsum.photos/342/317?random=23',
		title: 'Studio — Arts Quarter',
		sub: 'Available 1 Oct 2026',
		body: [
			'Bright 38 m² studio with exposed brick feature wall, open kitchen, and juliet balcony. 5-min walk to the tube. No pets, no smokers.',
		],
		dict: [
			{
				key: 'Rent',
				value: '£1,450 / month',
			},
			{
				key: 'Deposit',
				value: '£2,900',
			},
			{
				key: 'Available',
				value: '1 Oct 2026',
			},
		],
		footer: 'Updated 11 Sep 2026',
	},
	{
		className: 'safe shadow corner',
		icon: 'icon-paw',
		title: 'Luna — 2-Year-Old Golden Retriever Mix Ready for Her Forever Home',
		sub: 'City Animal Shelter',
		sup: 'Ready to Adopt',
		body: [
			'House-trained and great with children and other dogs. Loves long walks, fetch, and sleeping at your feet.',
			'Spayed, microchipped, and up to date on all vaccinations. Adoption fee covers first vet check.',
		],
		tags: ['Dog', 'Golden mix', 'Kid-friendly', 'Vaccinated'],
		footer: 'Created 2 Sep 2026',
	},
	{
		className: 'tip shadow corner',
		img: 'https://picsum.photos/389/346?random=25',
		title: 'Fractured Light — Photography Exhibition',
		sub: 'The Modern Gallery · 14 Sep – 30 Nov',
		body: [
			'Forty works by twelve emerging photographers exploring identity, memory, and urban solitude.',
			'Long-exposure and infrared techniques give the images a dreamlike quality that holds up under scrutiny.',
			'Extended opening hours on Fridays until 21:00. Free entry on Tuesdays with museum membership.',
		],
		dict: [
			{
				key: 'Venue',
				value: 'The Modern Gallery',
			},
			{
				key: 'Dates',
				value: '14 Sep – 30 Nov',
			},
			{
				key: 'Admission',
				value: '$12 / free Tue',
			},
		],
	},
	{
		className: 'major shadow corner',
		img: 'https://picsum.photos/436/375?random=26',
		title: 'Lumio',
		body: [
			'AI-powered meal planning that learns your taste, dietary needs, and budget — generating weekly plans with auto-filled grocery lists. iOS and Android. First month free.',
		],
		tags: ['AI', 'Food-tech', 'Freemium'],
		dict: [
			{
				key: 'Funding',
				value: '$1.2 M seed',
			},
			{
				key: 'Users',
				value: '8,400 at launch',
			},
			{
				key: 'Price',
				value: '$9.99 / month',
			},
		],
		footer: 'Created 10 Sep 2026',
	},
	{
		className: 'danger shadow corner',
		icon: 'icon-bar-chart',
		title: 'Q2 2026 Earnings Report',
		sup: 'Confidential · Internal',
		body: [
			'Revenue down 8% YoY driven by weaker consumer spending in APAC. EBITDA margin held at 18%.',
			'Management reiterating full-year guidance. Cost-reduction programme remains on track for Q4 completion.',
		],
		dict: [
			{
				key: 'Revenue',
				value: '$214 M (–8% YoY)',
			},
			{
				key: 'EBITDA margin',
				value: '18%',
			},
			{
				key: 'Guidance',
				value: 'Maintained',
			},
		],
	},
	{
		className: 'danger shadow corner',
		img: 'https://picsum.photos/483/303?random=28',
		title:
			'Notice of Proposed Class Action Settlement — DataPulse Subscribers Jan 2022 to Jun 2025',
		sub: 'Superior Court · Case No. 2026-CV-04471',
		body: [
			'If you purchased a DataPulse subscription in the specified period you may be entitled to compensation. Claim deadline: 31 Oct 2026.',
		],
		tags: ['Settlement', 'Class action', 'Deadline Oct'],
		dict: [
			{
				key: 'Case',
				value: '2026-CV-04471',
			},
			{
				key: 'Claim deadline',
				value: '31 Oct 2026',
			},
		],
		footer: 'Updated 1 Sep 2026',
	},
	{
		className: 'danger shadow corner',
		icon: 'icon-exclamation-triangle',
		img: 'https://picsum.photos/329/332?random=29',
		title: 'Allergy Recall Alert',
		sub: 'Food Safety Authority',
		sup: 'Urgent Recall',
		body: [
			'Batch codes A204–A211 of "Harvest Crunch Granola Bars" may contain undeclared peanuts. Do not consume if you have a peanut allergy. Return to point of purchase for a full refund.',
		],
		tags: ['Recall', 'Peanuts', 'Urgent', 'Batches A204–A211'],
	},
	{
		className: 'tip shadow corner',
		icon: 'icon-leaf',
		title: 'Global Surface Temperature Exceeds +1.6°C Above Pre-Industrial Baseline for First Time',
		sub: 'IPCC · Annual Climate Report 2026',
		body: [
			'The 2026 IPCC annual report confirms a new global temperature record driven primarily by continued fossil fuel emissions.',
			'Arctic sea-ice extent reached a record summer minimum; permafrost carbon release is now measurable at regional scale.',
			'Mitigation pathways to 1.5°C now require near-immediate elimination of unabated coal power and an 80% drop in methane emissions by 2030.',
		],
		dict: [
			{
				key: 'Temp anomaly',
				value: '+1.6°C (2026)',
			},
			{
				key: 'Published',
				value: 'Sep 2026',
			},
			{
				key: 'Source',
				value: 'IPCC AR7',
			},
		],
		footer: 'Created 5 Sep 2026',
	},
	{
		className: 'minor shadow corner',
		img: 'https://picsum.photos/376/361?random=31',
		title: 'New Antibiotic vs XDR-TB',
		sub: 'University of Cape Town',
		sup: 'Breakthrough',
		body: [
			'Researchers identified a novel compound — UCT-783 — that kills extensively drug-resistant tuberculosis bacteria in vitro with no detectable cytotoxicity.',
			'Phase I human trials are scheduled to begin Q1 2027 at three sites across Sub-Saharan Africa.',
		],
		tags: ['Antibiotic', 'TB', 'Phase I 2027'],
	},
	{
		className: 'danger shadow corner',
		icon: 'icon-check-square-o',
		title: 'District 7 Result',
		body: [
			'Councillor Sandra Ortega (Progressive) wins the runoff with 52.4%, defeating incumbent Ray Huang (Conservative).',
			'Voter turnout reached 61% — the highest in 16 years, driven by record youth participation.',
		],
		tags: ['Election', 'District 7', 'Official'],
		dict: [
			{
				key: 'Winner',
				value: 'Sandra Ortega 52.4%',
			},
			{
				key: 'Turnout',
				value: '61%',
			},
			{
				key: 'Certified',
				value: '12 Sep 2026',
			},
		],
		footer: 'Updated 12 Sep 2026, 23:58',
	},
	{
		className: 'tip shadow corner',
		img: 'https://picsum.photos/423/390?random=33',
		title:
			'Lantern Festival at Riverside Park — Free Family Evening with Dragon Dance, Street Food, and Live Music',
		sup: 'This Weekend',
		body: [
			'Float hundreds of glowing lanterns on the river at dusk while sampling street food from 30 vendors. Traditional dragon dance performance at 20:30.',
		],
		tags: ['Free entry', 'Family', 'Street food', 'Sat–Sun'],
	},
	{
		className: 'safe shadow corner',
		img: 'https://picsum.photos/470/318?random=34',
		title: "Children's Hospital Bake Sale",
		sub: 'Community · Volunteers Welcome',
		sup: 'Fundraiser',
		body: [
			'Annual bake sale in aid of the Paediatric Wing renovation fund. All proceeds go directly to equipment upgrades.',
			'Donations also accepted online. Help us reach our $15,000 goal — $9,240 raised so far!',
		],
		dict: [
			{
				key: 'Date',
				value: 'Sat 20 Sep 2026',
			},
			{
				key: 'Goal',
				value: '$15,000',
			},
			{
				key: 'Raised so far',
				value: '$9,240',
			},
		],
		footer: 'Updated 11 Sep 2026',
	},
	{
		className: 'default shadow corner',
		icon: 'icon-key',
		title:
			'Cobbler & Keys — Shoe Repair, Key Cutting & Locksmith Services · Family-owned Since 1971',
		sub: 'Elmwood · Est. 1971',
		body: [
			'Three generations of shoe repair, key cutting, and lock services in the heart of Elmwood. Same-day service on standard repairs.',
		],
		dict: [
			{
				key: 'Hours',
				value: 'Mon–Sat 08:00–18:00',
			},
			{
				key: 'Phone',
				value: '+1 555 873 2210',
			},
			{
				key: 'Google rating',
				value: '5.0 ★ (480 reviews)',
			},
		],
	},
	{
		className: 'minor shadow corner',
		img: 'https://picsum.photos/316/347?random=36',
		title: 'The Insider',
		body: [
			'Darknet Diaries Ep. 201: Jack Rhysider tells the true story of a sysadmin who spent two years exfiltrating intellectual property for a foreign state actor.',
			'The investigation began with a single log-file anomaly flagged by an automated SIEM rule — a reminder that the boring stuff saves companies.',
			'Runtime: 58 minutes. Available on Spotify, Apple Podcasts, and wherever you get your podcasts.',
		],
		tags: ['Cybersecurity', 'True crime', 'Insider threat', '58 min'],
		footer: 'Created 9 Sep 2026',
	},
	{
		className: 'major shadow corner',
		img: 'https://picsum.photos/363/376?random=37',
		title: 'Node.js v24 LTS',
		sup: 'Long-Term Support',
		body: [
			'Built-in WebAssembly GC, native fetch improvements, and a 20% throughput increase on I/O-heavy workloads. Upgrade recommended for all production environments.',
		],
		dict: [
			{
				key: 'Version',
				value: '24.0.0',
			},
			{
				key: 'Support until',
				value: 'Apr 2030',
			},
			{
				key: 'Breaking changes',
				value: 'See migration guide',
			},
		],
	},
	{
		className: 'tip shadow corner',
		img: 'https://picsum.photos/410/304?random=38',
		title: 'Void Frontier World Championship 2026 — $500,000 Prize Pool · 64 Teams · Live in Seoul',
		sub: 'Esports · 14–16 Nov 2026',
		sup: 'Registration Open',
		body: [
			'The inaugural VF World Championship brings together 64 regional finalists for a 3-day live event in Seoul.',
			'Qualifying brackets close 30 September. Spectator tickets now available — floor seats already sold out.',
		],
		tags: ['Esports', '$500k', 'Seoul', '64 teams'],
		dict: [
			{
				key: 'Dates',
				value: '14–16 Nov 2026',
			},
			{
				key: 'Prize pool',
				value: '$500,000',
			},
			{
				key: 'Qualifier deadline',
				value: '30 Sep 2026',
			},
		],
		footer: 'Updated 10 Sep 2026',
	},
	{
		className: 'safe shadow corner',
		img: 'https://picsum.photos/457/333?random=39',
		title: 'Isabel & Thomas — Save the Date',
		sub: 'Provence · 22 March 2027',
		body: [
			"We're getting married at Château Vieux in Provence. Formal invitations follow in November. Dress code: garden formal.",
		],
		dict: [
			{
				key: 'Date',
				value: '22 March 2027',
			},
			{
				key: 'Venue',
				value: 'Château Vieux, Provence',
			},
			{
				key: 'RSVP by',
				value: '15 Jan 2027',
			},
		],
		footer: 'Created 1 Sep 2026',
	},
	{
		className: 'tip shadow corner',
		icon: 'icon-child',
		title: 'Welcome Little Mia',
		sub: 'Baby Shower · 28 Sep 2026',
		sup: 'Private Invite',
		body: [
			"Join us for afternoon tea and games at Claire's place. Gift registry linked separately. RSVP by 21 September — limited to 20 guests.",
		],
		tags: ['Baby shower', 'Afternoon tea', 'RSVP needed'],
		footer: 'Updated 5 Sep 2026',
	},
	{
		className: 'default shadow corner',
		img: 'https://picsum.photos/303/362?random=41',
		title: 'In Memoriam — George Ellison, Beloved Husband, Father, and Headmaster (1941–2026)',
		sub: 'Passed peacefully 10 Sep 2026',
		body: [
			'George Ellison passed away at home surrounded by family after a short illness. He served as headmaster of Elmwood Secondary for 24 years and was known for his warmth and fairness.',
			"A memorial service will be held at St. Mary's on 18 September at 11:00. All who knew him are welcome. In lieu of flowers, donations to Alzheimer's Research UK are appreciated.",
		],
		dict: [
			{
				key: 'Service',
				value: '18 Sep 2026, 11:00',
			},
			{
				key: 'Venue',
				value: "St. Mary's Church",
			},
			{
				key: 'Donations',
				value: "Alzheimer's Research UK",
			},
		],
	},
	{
		className: 'minor shadow corner',
		img: 'https://picsum.photos/350/391?random=42',
		title: 'Sony WH-1000XM7 Review',
		body: [
			"Sony's seventh-generation flagship sets a new standard for noise cancellation. The updated driver delivers richer bass without sacrificing midrange clarity. Battery now lasts 38 hours.",
		],
		tags: ['Headphones', 'ANC', '38-hr battery', '★ 4.8 / 5'],
		dict: [
			{
				key: 'Price',
				value: '$349',
			},
			{
				key: 'Battery',
				value: '38 hrs (ANC on)',
			},
			{
				key: 'Verdict',
				value: 'Best in class',
			},
		],
		footer: 'Created 7 Sep 2026',
	},
	{
		className: 'default shadow corner',
		icon: 'icon-file-text-o',
		title: 'Q3 Hiring Freeze',
		sup: 'Confidential · All Staff',
		body: [
			'Effective immediately, all open positions are paused pending the Q3 financial review. Existing offers already extended will be honoured. Direct questions to your department head.',
		],
		dict: [
			{
				key: 'Effective',
				value: 'Immediately',
			},
			{
				key: 'Review date',
				value: '1 Nov 2026',
			},
			{
				key: 'Contact',
				value: 'HR Business Partner',
			},
		],
		footer: 'Updated 12 Sep 2026',
	},
	{
		className: 'major shadow corner',
		img: 'https://picsum.photos/397/319?random=44',
		title:
			'CSS State of the Art — Container Queries, Cascade Layers & the New Color Function Landscape',
		sub: 'CSSConf 2026 · Track B · 15 Oct',
		sup: 'Featured Talk',
		body: [
			'A deep-dive into modern CSS features with live demos of real-world performance gains in a production design system.',
			"Q&A follows the 45-minute session. Slides published on speaker's site the same evening.",
		],
		dict: [
			{
				key: 'Speaker',
				value: 'Lea Verou',
			},
			{
				key: 'Date',
				value: '15 Oct 2026, 14:30',
			},
			{
				key: 'Room',
				value: 'Hall 4, Track B',
			},
		],
	},
	{
		className: 'safe shadow corner',
		img: 'https://picsum.photos/444/348?random=45',
		title: 'Ancient Rome',
		sub: 'Natural History Museum · New East Wing',
		body: [
			"200 artefacts from everyday Roman life — ceramic vessels, surgical instruments, children's toys, and graffiti casts from Pompeii.",
			'The new East Wing doubles the display space and introduces an interactive digital layer synced to each artefact label.',
			'Guided audio tour included with museum admission. Schools programme available on weekday mornings.',
		],
		tags: ['Ancient Rome', 'Pompeii', 'New wing', 'Audio tour'],
		footer: 'Created 1 Sep 2026',
	},
	{
		className: 'default shadow corner',
		icon: 'icon-book',
		title:
			'Author Talk & Signing — Amara Diallo Reads from "The Cartography of Loss" at Elmwood Public Library',
		body: [
			'Join Booker Prize-shortlisted author Amara Diallo for a reading and Q&A. Books available for signing. Reserve your seat — capacity 60.',
		],
		tags: ['Free', 'Signing', '60 seats'],
		dict: [
			{
				key: 'Date',
				value: '18 Sep 2026, 18:30',
			},
			{
				key: 'Venue',
				value: 'Elmwood Public Library',
			},
			{
				key: 'Cost',
				value: 'Free',
			},
		],
		footer: 'Updated 9 Sep 2026',
	},
	{
		className: 'safe shadow corner',
		img: 'https://picsum.photos/491/377?random=47',
		title: 'Beach Clean-up Crew',
		sub: 'Coastal Care · Sat 27 Sep',
		body: [
			'Help us clear 2 km of coastline ahead of nesting season. Equipment and gloves provided. Meet at the Pier carpark at 08:00.',
			'Coffee and breakfast rolls included. All ages welcome — the more the merrier. 8 of 20 spots filled.',
		],
		tags: ['Volunteer', 'Environment', 'Family OK', 'Free breakfast'],
	},
	{
		className: 'minor shadow corner',
		img: 'https://picsum.photos/337/305?random=48',
		title: 'Park Playground Poll',
		sub: 'City Council · Maple Park',
		sup: 'Have Your Say',
		body: [
			'Choose between three proposed playground designs. Design A: nature-themed timber. Design B: inclusive sensory garden. Design C: sports and fitness equipment. Closes 30 September.',
		],
		dict: [
			{
				key: 'Leading option',
				value: 'Design B (48%)',
			},
			{
				key: 'Total votes',
				value: '1,240',
			},
			{
				key: 'Closes',
				value: '30 Sep 2026',
			},
		],
		footer: 'Updated 11 Sep 2026',
	},
	{
		className: 'tip shadow corner',
		img: 'https://picsum.photos/384/334?random=49',
		title: 'Friday Market',
		body: [
			'Over 60 vendors selling street food, vinyl records, vintage clothing, handmade jewellery, and artisan spirits in the Warehouse District.',
			'Live DJ set from 20:00. Dog-friendly. Cash and card accepted. Free entry every week.',
		],
		tags: ['Every Friday', 'Street food', 'Vintage', 'Dog-friendly', 'Free'],
		footer: 'Created 4 Sep 2026',
	},
	{
		className: 'danger shadow corner',
		icon: 'icon-bell',
		title:
			'FLASH FLOOD WARNING — Mandatory Evacuation Order for Zone C: Low-lying Streets Must Evacuate Immediately',
		sub: 'Emergency Management · Issued 12 Sep 2026, 14:47',
		sup: 'EMERGENCY',
		body: [
			'A FLASH FLOOD WARNING is in effect for Zone C. River levels are rising rapidly following 180 mm of rainfall in six hours.',
			"Residents in low-lying streets must proceed immediately to the nearest designated shelter. Do not drive through floodwater under any circumstances — turn around, don't drown.",
			'Pets are welcome at the Elmwood shelter. Medication and essential documents only — leave immediately, do not delay to pack.',
		],
		tags: ['Flash flood', 'Zone C', 'Evacuate NOW', 'EMERGENCY'],
		dict: [
			{
				key: 'Zone',
				value: 'C — Low-lying streets',
			},
			{
				key: 'Valid until',
				value: '12 Sep 2026, 20:00',
			},
			{
				key: 'Nearest shelter',
				value: 'Elmwood Community Hall',
			},
			{
				key: 'Helpline',
				value: '1800 EM HELP',
			},
		],
		footer: 'Updated 12 Sep 2026, 15:02',
	},
];
