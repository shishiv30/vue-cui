import type { App, Directive } from 'vue';
import Article from '../components/Article.vue';
import Checkbox from '../components/Checkbox.vue';
import DropdownCheckbox from '../components/DropdownCheckbox.vue';
import DropdownRadio from '../components/DropdownRadio.vue';
import GroupDropdown from '../components/GroupDropdown.vue';
import Header from '../components/Header.vue';
import Layout from '../components/Layout.vue';
import Map from '../components/Map.vue';
import Player from '../components/Player.vue';
import Radio from '../components/Radio.vue';
import RangeSlider from '../components/RangeSlider.vue';
import Select from '../components/Select.vue';
import Sharelink from '../components/Sharelink.vue';
import Shifter from '../components/Shifter.vue';
import Slider from '../components/Slider.vue';
import Textbox from '../components/Textbox.vue';
import ValueSlider from '../components/ValueSlider.vue';
import Welcome from '../components/Welcome.vue';
import autocomplete from '../directives/autocomplete';
import collapse from '../directives/collapse';
import dialog from '../directives/dialog';
import lazyload from '../directives/lazyload';
import modal from '../directives/modal';
import scrollto from '../directives/scrollto';
import tab from '../directives/tab';
import theme from '../directives/theme';
import tooltip from '../directives/tooltip';

export {
	Article,
	Checkbox,
	DropdownCheckbox,
	DropdownRadio,
	GroupDropdown,
	Header,
	Layout,
	Map,
	Player,
	Radio,
	RangeSlider,
	Select,
	Sharelink,
	Shifter,
	Slider,
	Textbox,
	ValueSlider,
	Welcome,
	autocomplete,
	collapse,
	dialog,
	lazyload,
	modal,
	scrollto,
	tab,
	theme,
	tooltip,
};

export type { FormEnumOption } from '../components/formEnumOption';
export type { ArticleUiModel, ArticleAttr, ArticleTag } from '../components/articleModel';
export type {
	MapUiModel,
	MapMarker,
	MapPinTheme,
	MapLatLng,
	MapBounds,
	MapType,
} from '../components/mapModel';
export type { MapGroup, MapMergeTree } from '../components/mapMerge';
export { buildMergeTree, groupsAt } from '../components/mapMerge';
export type { MapStyleName, MapStyleSetting, MapStyleOverlay } from '../components/mapStyles';
export { mapStyleList, defaultMapStyle, mapStyleOverlay } from '../components/mapStyles';
export type {
	WelcomeUiModel,
	WelcomeData,
	WelcomePanel,
	WelcomeSrc,
	WelcomeAnimation,
	WelcomeAnimationMode,
} from '../components/welcomeModel';
export type {
	AutocompleteItem,
	AutocompleteFetcher,
	AutocompleteSource,
	AutocompleteOptions,
	AutocompleteValue,
} from '../directives/autocomplete';
export type { ScrollToOptions, ScrollToValue } from '../directives/scrollto';
export type { SharelinkUiModel, SharelinkPlatformId } from '../components/sharelinkModel';
export {
	SHARELINK_PLATFORM_IDS,
	SHARELINK_AI_IDS,
	SHARELINK_DEFAULT_PLATFORMS,
} from '../components/sharelinkModel';
export type { HeaderUiModel, HeaderMenuItem, HeaderSearch } from '../components/headerModel';

const components = {
	Article,
	Checkbox,
	DropdownCheckbox,
	DropdownRadio,
	GroupDropdown,
	Header,
	Layout,
	Map,
	Player,
	Radio,
	RangeSlider,
	Select,
	Sharelink,
	Shifter,
	Slider,
	Textbox,
	ValueSlider,
	Welcome,
};

const directives: Record<string, Directive> = {
	autocomplete,
	collapse,
	dialog,
	lazyload,
	modal,
	scrollto,
	tab,
	theme,
	tooltip,
} as Record<string, Directive>;

export default {
	install(app: App) {
		for (const [name, component] of Object.entries(components)) {
			app.component(`C${name}`, component);
		}
		for (const [name, directive] of Object.entries(directives)) {
			app.directive(name, directive);
		}
	},
};
