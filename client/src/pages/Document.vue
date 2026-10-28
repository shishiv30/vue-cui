<template>
	<Header :model="header" />
	<main id="main" role="main" data-document-marker="vue-document">
		<section class="section large" id="welcome">
			<div class="fixed fixed-max-xs panel inline corner-1 grid grid-xs-1 large">
				<div class="flex vertical">
					<h1 class="f3">Welcome to pure UI:</h1>
					<div>
						This is a lightweight UI framework that focuses solely on client-side
						rendering for user experience. The framework itself is dedicated to
						enhancing user experience. The core idea is to define interface states
						purely with CSS and to use pure JavaScript for interaction and state
						switching.
					</div>
				</div>
				<div class="flex vertical">
					<h2 class="f4">Why pure UI</h2>
					<div>
						This framework succinctly encapsulates the core concepts of UI design,
						compressing most important concepts into less than 20 keywords. This ensures
						that anyone using the framework, as long as they understand its core
						concepts, can easily grasp any knowledge point within the system and apply
						it elsewhere.
					</div>
				</div>
				<div class="flex vertical">
					<h2 class="f4">What need Learn before use it</h2>
					<div>
						If you are familiar with and understand the meanings of the following words,
						then you have mastered the core concepts of this framework:
					</div>
					<ul class="grid grid-xs-1">
						<li v-for="item in keywords" :key="item.term" class="flex middle">
							<span class="attr gray">{{ item.term }}</span>{{ item.meaning }}
						</li>
					</ul>
				</div>
			</div>
		</section>
		<section class="section large">
			<div class="fixed fixed-max-xs panel large inline corner-1 grid grid-xs-1">
				<h2 class="f3">Color list</h2>
				<template v-for="group in colorGroups" :key="group.title">
					<h3 class="f5">{{ group.title }}</h3>
					<ul class="grid">
						<li v-for="token in group.tokens" :key="token" class="flex middle">
							<span
								class="circle tiny"
								:style="{ backgroundColor: 'var(' + token + ')' }"
							></span>{{ token }}
						</li>
					</ul>
					<div v-if="group.button" class="flex wrap">
						<button type="button" class="btn" :class="group.button">
							{{ group.button }}
						</button>
						<button type="button" class="btn active" :class="group.button">
							{{ group.button }}-active
						</button>
					</div>
				</template>
			</div>
		</section>
		<section class="section large inline bg active">
			<div class="fixed fixed-max-xs panel large inline corner-1 grid grid-xs-1">
				<h2 class="f3">Button</h2>
				<div class="flex wrap">
					<button type="button" class="btn default">
						<i class="icon-plus"></i> Apply
					</button>
					<button type="button" class="btn gray">
						<i class="icon-plus"></i> Apply
					</button>
					<button type="button" class="btn danger">
						<i class="icon-plus"></i> Apply
					</button>
					<button type="button" class="btn minor">
						<i class="icon-plus"></i> Apply
					</button>
					<button type="button" class="btn major">
						<i class="icon-plus"></i> Apply
					</button>
					<button type="button" class="btn safe">
						<i class="icon-plus"></i> Apply
					</button>
					<button type="button" class="btn tip">
						<i class="icon-plus"></i> The long text button Apply will be truncated
					</button>
				</div>
				<div class="flex wrap">
					<button type="button" class="btn default active">
						<i class="icon-plus"></i> Apply
					</button>
					<button type="button" class="btn gray active">
						<i class="icon-plus"></i> Apply
					</button>
					<button type="button" class="btn danger active">
						<i class="icon-plus"></i> Apply
					</button>
					<button type="button" class="btn minor active">
						<i class="icon-plus"></i> Apply
					</button>
					<button type="button" class="btn major active">
						<i class="icon-plus"></i> Apply
					</button>
					<button type="button" class="btn safe active">
						<i class="icon-plus"></i> Apply
					</button>
					<button type="button" class="btn tip active">
						<i class="icon-plus"></i> The long text button Apply will be truncated
					</button>
				</div>
			</div>
		</section>
		<section class="section large">
			<div class="fixed default fixed-max-xs bg active panel large inline corner-1 grid grid-xs-1">
				<h2 class="f3">Tag</h2>
				<div class="flex wrap">
					<button type="button" class="attr active default"><i class="icon-plus"></i> Tag</button>
					<button type="button" class="attr active gray"><i class="icon-plus"></i> Tag</button>
					<button type="button" class="attr active danger"><i class="icon-plus"></i> Tag</button>
					<button type="button" class="attr active minor"><i class="icon-plus"></i> Tag</button>
					<button type="button" class="attr active major"><i class="icon-plus"></i> Tag</button>
					<button type="button" class="attr active safe"><i class="icon-plus"></i> Tag</button>
					<button type="button" class="attr active tip">
						<i class="icon-plus"></i>The long text tag will be truncated
					</button>
				</div>
				<div class="flex wrap">
					<button type="button" class="attr default"><i class="icon-plus"></i> Tag</button>
					<button type="button" class="attr gray"><i class="icon-plus"></i> Tag</button>
					<button type="button" class="attr danger"><i class="icon-plus"></i> Tag</button>
					<button type="button" class="attr minor"><i class="icon-plus"></i> Tag</button>
					<button type="button" class="attr major"><i class="icon-plus"></i> Tag</button>
					<button type="button" class="attr safe"><i class="icon-plus"></i> Tag</button>
					<button type="button" class="attr tip">
						<i class="icon-plus"></i>The long text tag will be truncated
					</button>
				</div>
			</div>
		</section>
		<section class="section large inline">
			<div class="fixed fixed-max-xs panel large inline corner-1 grid grid-xs-1">
				<h2 class="f3">Circle</h2>
				<h3 class="f5">Colors</h3>
				<div class="flex wrap middle">
					<span class="circle default small">1</span>
					<span class="circle gray small">2</span>
					<span class="circle danger small">3</span>
					<span class="circle minor small">4</span>
					<span class="circle major small">5</span>
					<span class="circle safe small">6</span>
					<span class="circle tip small">7</span>
				</div>
				<h3 class="f5">Colors (active)</h3>
				<div class="flex wrap middle">
					<span class="circle default small active">1</span>
					<span class="circle gray small active">2</span>
					<span class="circle danger small active">3</span>
					<span class="circle minor small active">4</span>
					<span class="circle major small active">5</span>
					<span class="circle safe small active">6</span>
					<span class="circle tip small active">7</span>
				</div>
				<h3 class="f5">Sizes</h3>
				<div class="flex wrap middle">
					<span class="circle default tiny">t</span>
					<span class="circle default small">s</span>
					<span class="circle default">n</span>
					<span class="circle default large">L</span>
				</div>
			</div>
		</section>
		<section class="section large">
			<div class="panel fixed fixed-max-xs grid grid-xs-1">
				<h2 class="f3">List dict</h2>
				<p class="f6">Key/value facts in a responsive grid (<code>data-role="list-dict"</code>).</p>
				<h3 class="f5">Property facts</h3>
				<ul class="list-dict" data-role="list-dict">
					<li>
						<abbr class="key" title="List price">Price</abbr>
						<span class="value">$425,000</span>
					</li>
					<li>
						<abbr class="key" title="Bedrooms, bathrooms, living area">Layout</abbr>
						<span class="value">3 bd · 2 ba · 1,840 sqft</span>
					</li>
					<li>
						<abbr class="key" title="Property type">Type</abbr>
						<span class="value">Single Family</span>
					</li>
					<li>
						<abbr class="key" title="Year built">Built</abbr>
						<span class="value">1987</span>
					</li>
					<li>
						<abbr class="key" title="Lot size">Lot</abbr>
						<span class="value">0.18 acres</span>
					</li>
					<li>
						<abbr class="key" title="City, state, ZIP">Location</abbr>
						<span class="value">Austin, TX 78704</span>
					</li>
				</ul>
			</div>
		</section>
		<section class="section large">
			<div class="panel fixed fixed-max-xs grid grid-xs-1">
				<h2 class="f3">Collapse</h2>
				<div>
					<button type="button" v-collapse="'#caretPanel1'">
						<span>show content</span>
						<i class="icon-angle-left"></i>
					</button>
					<div id="caretPanel1" class="collapse-panel">
						This is a lightweight UI framework, the goal is to create a UI solution that
						simplifies the memory extension markup. The principle of code writing is to
						achieve as many UI components as possible through html standards so as to
						reduce unnecessary dependencies.
					</div>
				</div>
				<div>
					<div id="caretPanel2" class="collapse-line multiline-2">
						This is a lightweight UI framework, the goal is to create a UI solution that
						simplifies the memory extension markup. The principle of code writing is to
						achieve as many UI components as possible through html standards so as to
						reduce unnecessary dependencies.
					</div>
					<button class="link" type="button" v-collapse="'#caretPanel2'">
						<span>show more</span>
					</button>
				</div>
			</div>
		</section>
		<section class="section" id="tipPanel">
			<div class="fixed fixed-max-xs grid grid-xs-3">
				<h2 class="f3 wrap">Tips</h2>
				<div class="text-left">
					<a href="javascript:;" class="link"
						v-tooltip="'show on top side, not enough space focus left'">top left</a>
				</div>
				<div class="text-center">
					<a href="javascript:;" class="link"
						v-tooltip="'show on top side, enough space align center'">top center</a>
				</div>
				<div class="text-right">
					<a href="javascript:;" class="link"
						v-tooltip="'show on top side, not enough space focus right'">top right</a>
				</div>
				<div class="text-left">
					<a href="javascript:;" class="link"
						v-tooltip.bottom="'show on bottom side, not enough space focus left'">bottom left</a>
				</div>
				<div class="text-center">
					<a href="javascript:;" class="link"
						v-tooltip.bottom="'show on bottom side, enough space align center'">bottom center</a>
				</div>
				<div class="text-right">
					<a href="javascript:;" class="link"
						v-tooltip.bottom="'show on bottom side, not enough space focus right'">bottom right</a>
				</div>
				<div class="text-left">
					<a href="javascript:;" class="link"
						v-tooltip.click.right="'show on right side'">right (click)</a>
				</div>
				<div></div>
				<div class="text-right">
					<a href="javascript:;" class="link"
						v-tooltip.click.left="'show on left side'">left (click)</a>
				</div>
			</div>
		</section>
		<section class="section large">
			<div class="panel fixed fixed-max-xs grid grid-xs-1">
				<h2 class="f3">Tab</h2>
				<div>
					<div v-tab="0">
						<button type="button" class="tab default active" data-target="tab1">
							Tab1
						</button>
						<button type="button" class="tab default" data-target="tab2">Tab2</button>
						<button type="button" class="tab default" data-target="tab3">Tab3</button>
					</div>
					<div class="panel inline default tab-panel">
						<div data-id="tab1">Tab1</div>
						<div data-id="tab2" class="hide">Tab2</div>
						<div data-id="tab3" class="hide">Tab3</div>
					</div>
				</div>
			</div>
		</section>
		<section class="section large">
			<div class="panel fixed fixed-max-xs grid grid-xs-1">
				<h2 class="f3">Player</h2>
				<Player :model="player" />
			</div>
		</section>
		<section class="section large">
			<div class="panel fixed fixed-max-xs grid grid-xs-1">
				<h2 class="f3">Album</h2>
				<Slider :model="slider" />
			</div>
		</section>
		<section class="section large">
			<div class="panel fixed fixed-max-xs grid grid-xs-1">
				<h2 class="f3">Shifter</h2>
				<Shifter :model="shifter" />
			</div>
		</section>
		<section class="section large">
			<div class="panel fixed fixed-max-xs grid grid-xs-1">
				<h2 class="f3">Share link</h2>
				<div data-role="sharelink"></div>
			</div>
		</section>
		<section class="section large">
			<div class="panel fixed fixed-max-xs grid grid-xs-1">
				<div class="wrap">
					<h2 class="h3">Modal</h2>
					<p class="small text-muted">Template-based overlay (<code>data-role="modal"</code>).</p>
				</div>
				<a class="btn default small" href="javascript:;" data-role="modal" data-target="#popupPanel1">
					<span class="hidden-xs">Modal </span>Default
				</a>
				<div id="popupPanel1" hidden>
					<div class="grid grid-xs-1 large">
						<div class="h4">Welcome to CUI!</div>
						<div>
							A modal dialog is a window that forces the user to interact with it
							before they can go back to using the parent application.
						</div>
					</div>
				</div>
				<a class="btn default small" href="javascript:;" data-role="modal" data-target="#popupPanel0"
					data-theme="fullscreen">
					<span class="hidden-xs">Modal </span>Fullscreen
				</a>
				<div id="popupPanel0" hidden>
					<div data-modal="close">
						<div class="text-white">Welcome to CUI!</div>
						<div class="text-white">
							A modal dialog is a window that forces the user to interact with it
							before they can go back to using the parent application.
						</div>
					</div>
				</div>
				<a class="btn default small" href="javascript:;" data-role="modal" data-target="#popupPanel"
					data-theme="dropdown">
					<span class="hidden-xs">Modal </span>Dropdown
				</a>
				<div id="popupPanel" hidden>
					<div class="f3">Hello World!</div>
					<ul>
						<li><a href="javascript:;">Apple</a></li>
						<li><a href="javascript:;">Banana</a></li>
						<li><a href="javascript:;">Cat</a></li>
					</ul>
				</div>
			</div>
		</section>
		<section class="section large">
			<div class="panel fixed fixed-max-xs grid grid-xs-1">
				<div class="wrap">
					<h2 class="h3">Dialog</h2>
					<p class="small text-muted">
						HTML <code>&lt;dialog&gt;</code> with <code>showModal()</code>
						(<code>data-role="dialog"</code>).
					</p>
				</div>
				<button type="button" class="btn default small" data-role="dialog" data-target="#htmlDialogDemo">
					Open dialog
				</button>
				<dialog id="htmlDialogDemo" class="dialog" aria-labelledby="htmlDialogTitle">
					<div class="dialog-body">
						<button type="button" class="dialog-title-close" data-dialog="close" aria-label="Close">
							<i class="icon-close" aria-hidden="true"></i>
						</button>
						<div id="htmlDialogTitle" class="h4">Dialog</div>
						<p>
							Uses the HTML <code>dialog</code> element. Backdrop click closes when
							autoclose is enabled.
						</p>
					</div>
				</dialog>
			</div>
		</section>
		<section class="section large">
			<div class="panel fixed fixed-max-xs grid grid-xs-1">
				<h2 class="f3">ScrollTo</h2>
				<p>Scroll down the page, then click the button to scroll back to the first section.</p>
				<button type="button" class="btn default small" data-role="scrollto" data-target="#welcome">
					Scroll to first section
				</button>
			</div>
		</section>
		<section class="section bg default large" id="formPanel">
			<form class="fixed fixed-max-xs grid grid-xs-1 grid-sm-2" v-form="onSubmit">
				<div class="h4 wrap">Forms</div>
				<div>
					<label for="txtReq">Name (Required)</label>
					<div class="input left">
						<i class="icon-user-circle-o"></i>
						<input
							id="txtReq"
							name="username"
							placeholder="name"
							v-validation="'required'"
						/>
					</div>
				</div>
				<div>
					<label for="txtMail">Mail</label>
					<div class="input left">
						<i class="icon-envelope"></i>
						<input
							id="txtMail"
							name="email"
							placeholder="email"
							v-validation="'email'"
						/>
					</div>
				</div>
				<div>
					<label for="txtPhone">Phone (Required)</label>
					<div class="input left right">
						<i class="icon-phone"></i>
						<input
							id="txtPhone"
							name="phone"
							placeholder="phone"
							value="1234567890"
							v-validation="'required|phone'"
						/>
					</div>
				</div>
				<div>
					<label for="ddlFequence">Fequence (Required)</label>
					<div class="input left right">
						<i class="icon-ellipsis-v"></i>
						<select id="ddlFequence" name="fequence" v-validation="'required'">
							<option value="" selected disabled>select a fequence</option>
							<option
								v-for="option in selectMock"
								:key="option.value"
								:value="option.value"
							>
								{{ option.text }}
							</option>
						</select>
						<i disabled="disabled" class="icon-angle-down"></i>
					</div>
				</div>
				<Radio v-model="gender" :data="radioMock" label="Select Gender" />
				<Checkbox v-model="favor" :data="checkboxMock" label="Select Favor" />
				<div>
					<label>Rating</label>
					<br />
					<div class="group-btn default">
						<label v-for="n in 6" :key="'rate' + (n - 1)" :for="'rate' + (n - 1)">
							<input
								:id="'rate' + (n - 1)"
								name="rating"
								type="radio"
								:value="n - 1"
								:checked="n === 1"
							/>
							<span>{{ n - 1 }}</span>
						</label>
					</div>
				</div>
				<div>
					<label>Skills</label>
					<div class="group-btn default">
						<label v-for="skill in skills" :key="skill.value" :for="'skill-' + skill.value">
							<input
								:id="'skill-' + skill.value"
								name="skill"
								type="checkbox"
								:value="skill.value"
								:checked="skill.checked"
							/>
							<span>{{ skill.text }}</span>
						</label>
					</div>
				</div>
				<div class="checkbox single">
					<label for="confirm">
						<input id="confirm" name="confirm" type="checkbox" v-validation="'required'" />
						<span>Confirm to submit</span>
					</label>
				</div>
				<div class="wrap text-center">
					<button type="submit" class="btn default">Submit</button>
				</div>
			</form>
		</section>
		<section class="section large major inline bg active">
			<div class="fixed bg default fixed-max-xs grid grid-xs-1 grid-sm-2">
				<h2 class="f3 wrap">Textbox</h2>
				<div>
					<Select v-model="fequenceNormal" :data="selectMock" label="normal textbox select" />
				</div>
				<div>
					<Textbox v-model="emailNormal" type="input" label="normal textbox input" />
				</div>
				<div>
					<Select v-model="fequenceLarge" :data="selectMock" label="large textbox select" />
				</div>
				<div>
					<Textbox v-model="emailLarge" type="input" label="large textbox input" />
				</div>
				<div class="wrap">
					<Textbox v-model="note" type="textarea" label="textbox textarea" />
				</div>
			</div>
		</section>
		<section class="section large">
			<div class="panel fixed fixed-max-xs grid grid-xs-1">
				<h2 class="f3">Lazyload</h2>
				<div>
					<img
						v-for="src in player.images"
						:key="src"
						v-lazyload="src"
						:alt="'demo image ' + src"
					/>
				</div>
			</div>
		</section>
		<section class="section large" id="icons">
			<div class="panel fixed fixed-max-xs">
				<h2 class="f3">Icons</h2>
				<ul class="icon-catalog" @click="copyIcon">
					<li v-for="name in documentIcons" :key="name">
						<i :class="name"></i>
						<span>{{ name }}</span>
					</li>
				</ul>
			</div>
		</section>
	</main>
	<footer class="footer">
		<div class="section major large inline bg active">
			<div class="fixed fixed-max-xs grid grid-xs-1">
				<div class="footer-section">
					<div class="f4 text-bold">Contact Us</div>
					<p>Email: info@company.com</p>
					<p>Phone: (555) 123-4567</p>
					<p>Address: 123 Main St, City, State 12345</p>
				</div>
				<div class="footer-section">
					<div class="f4 text-bold">Follow Us</div>
					<div class="footer-social-link">
						<a href="#" aria-label="Facebook"><i class="icon-facebook"></i></a>
						<a href="#" aria-label="Twitter"><i class="icon-twitter"></i></a>
						<a href="#" aria-label="LinkedIn"><i class="icon-linkedin"></i></a>
						<a href="#" aria-label="Instagram"><i class="icon-instagram"></i></a>
					</div>
				</div>
				<div class="footer-section default bg">
					<div class="f4 text-bold">Newsletter</div>
					<p>Stay updated with our latest news and updates.</p>
					<form class="input minor left">
						<input type="email" placeholder="Enter your email" required />
						<button type="submit" class="btn primary" aria-label="Subscribe">
							<i class="icon-envelope"></i>
						</button>
					</form>
				</div>
				<div class="footer-bottom">
					<p>&copy; 2026 Company Name. All rights reserved.</p>
				</div>
			</div>
		</div>
	</footer>
	<div class="scroll-loading"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Header from '../components/Header.vue';
import Player from '../components/Player.vue';
import Slider from '../components/Slider.vue';
import Shifter from '../components/Shifter.vue';
import Radio from '../components/Radio.vue';
import Checkbox from '../components/Checkbox.vue';
import Select from '../components/Select.vue';
import Textbox from '../components/Textbox.vue';
import { headerMock } from '../components/headerModel';
import { playerMock } from '../components/playerModel';
import { sliderMock } from '../components/sliderModel';
import { shifterMock } from '../components/shifterModel';
import { radioMock, checkboxMock, selectMock } from '../components/formEnumOption';
import { documentIcons } from './documentIcons';

const header = headerMock;
const player = playerMock;
const slider = sliderMock;
const shifter = shifterMock;

const gender = ref('Male');
const favor = ref(['Dance']);
const fequenceNormal = ref('');
const fequenceLarge = ref('');
const emailNormal = ref('');
const emailLarge = ref('');
const note = ref('');

const skills = [
	{ value: 'C#', text: 'C#', checked: true },
	{ value: 'css', text: 'CSS', checked: false },
	{ value: 'javascript', text: 'Javascript', checked: false },
	{ value: 'nodejs', text: 'Node Js', checked: false },
];

const keywords = [
	{ term: 'x', meaning: 'horizontal setting,' },
	{ term: 'y', meaning: 'vertical setting,' },
	{ term: 'gap', meaning: 'gap size' },
	{ term: 'large', meaning: 'preset large size of gap' },
	{ term: 'small', meaning: 'preset small size of gap' },
	{ term: 'normal', meaning: 'preset default size of gap' },
	{ term: 'xs', meaning: 'phone device' },
	{ term: 'sm', meaning: 'tablet device' },
	{ term: 'md', meaning: 'dekstop device' },
	{ term: 'lg', meaning: 'large desktop device' },
	{ term: 'grid', meaning: 'grid system layout for multiple items like array' },
	{ term: 'flex', meaning: 'flex system layout for one item like an object with fields' },
	{ term: '0-9', meaning: 'value of color or size, lowest: 0, highest: 9' },
];

const colorGroups = [
	{
		title: 'Role',
		tokens: [
			'--color-r0', '--color-r1', '--color-r2', '--color-r3', '--color-r4',
			'--color-r5', '--color-r6', '--color-r7', '--color-r8', '--color-r9',
		],
	},
	{
		title: 'Base',
		tokens: [
			'--color', '--color-border', '--color-bg', '--color-hover',
			'--color-border-hover', '--color-bg-hover',
		],
	},
	{
		title: 'Base states',
		tokens: [],
		button: 'default',
	},
	{
		title: 'Level 1',
		tokens: [
			'--color-l1', '--color-border-l1', '--color-bg-l1', '--color-l1-hover',
			'--color-border-l1-hover', '--color-bg-l1-hover',
		],
	},
	{
		title: 'Active',
		tokens: [
			'--color-active', '--color-active-border', '--color-active-bg',
			'--color-active-hover', '--color-active-bg-hover', '--color-active-border-hover',
			'--color-disabled',
		],
	},
	{
		title: 'Major',
		tokens: [
			'--color-major', '--color-major-l1', '--color-major-hover', '--color-major-l1-hover',
		],
		button: 'major',
	},
	{
		title: 'Minor',
		tokens: [
			'--color-minor', '--color-minor-l1', '--color-minor-hover', '--color-minor-l1-hover',
		],
		button: 'minor',
	},
	{
		title: 'Safe',
		tokens: [
			'--color-safe', '--color-safe-l1', '--color-safe-hover', '--color-safe-l1-hover',
		],
		button: 'safe',
	},
	{
		title: 'Danger',
		tokens: [
			'--color-danger', '--color-danger-l1', '--color-danger-hover', '--color-danger-l1-hover',
		],
		button: 'danger',
	},
	{
		title: 'Tip',
		tokens: [
			'--color-tip', '--color-tip-l1', '--color-tip-hover', '--color-tip-l1-hover',
		],
		button: 'tip',
	},
	{
		title: 'Link',
		tokens: ['--color-link', '--color-link-hover'],
	},
	{
		title: 'Scale',
		tokens: [
			'--color-0', '--color-1', '--color-2', '--color-3', '--color-4',
			'--color-5', '--color-6', '--color-7', '--color-8', '--color-9',
		],
	},
];

function onSubmit(payload: Record<string, unknown>) {
	console.log(payload);
}

function copyIcon(event: MouseEvent) {
	const label = (event.target as HTMLElement | null)?.closest('span');
	const text = label?.textContent?.trim();
	if (!text || !navigator.clipboard) {
		return;
	}
	navigator.clipboard.writeText(text);
}
</script>
