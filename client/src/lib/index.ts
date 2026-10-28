import type { App, Directive } from 'vue';
import Article from '../components/Article.vue';
import Checkbox from '../components/Checkbox.vue';
import DropdownCheckbox from '../components/DropdownCheckbox.vue';
import DropdownRadio from '../components/DropdownRadio.vue';
import GroupDropdown from '../components/GroupDropdown.vue';
import Header from '../components/Header.vue';
import Layout from '../components/Layout.vue';
import Player from '../components/Player.vue';
import Radio from '../components/Radio.vue';
import RangeSlider from '../components/RangeSlider.vue';
import Select from '../components/Select.vue';
import Shifter from '../components/Shifter.vue';
import Slider from '../components/Slider.vue';
import Textbox from '../components/Textbox.vue';
import ValueSlider from '../components/ValueSlider.vue';
import collapse from '../directives/collapse';
import lazyload from '../directives/lazyload';
import tab from '../directives/tab';
import tooltip from '../directives/tooltip';

export {
	Article,
	Checkbox,
	DropdownCheckbox,
	DropdownRadio,
	GroupDropdown,
	Header,
	Layout,
	Player,
	Radio,
	RangeSlider,
	Select,
	Shifter,
	Slider,
	Textbox,
	ValueSlider,
	collapse,
	lazyload,
	tab,
	tooltip,
};

export type { FormEnumOption } from '../components/formEnumOption';
export type { ArticleUiModel, ArticleAttr, ArticleTag } from '../components/articleModel';
export type { HeaderUiModel, HeaderMenuItem, HeaderSearch } from '../components/headerModel';

const components = {
	Article,
	Checkbox,
	DropdownCheckbox,
	DropdownRadio,
	GroupDropdown,
	Header,
	Layout,
	Player,
	Radio,
	RangeSlider,
	Select,
	Shifter,
	Slider,
	Textbox,
	ValueSlider,
};

const directives: Record<string, Directive> = { collapse, lazyload, tab, tooltip } as Record<string, Directive>;

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
