# Component conversion

Turn one EJS + plugin pair into a Vue component, one component at a time. Pages keep rendering the EJS and the old plugin until a later swap.

## Steps

1. **Markup.** Read `server/ejs/comp_<name>.ejs`. Keep the same class names. No `<style>` block and no new stylesheet.
2. **Data.** Read the data builder (`getHeaderData`, `mapAlbumToComp`, or the object the template already receives). That object is the UI model. Do not invent a second shape.
3. **Lifecycle.** Read `client/js/plugins/_<name>.js`. Port `init` into the Vue component and remove listeners in `onBeforeUnmount`. Emit the same phase events as `Plugin.emitPhase` through `client/src/components/emitPhase.ts`. On mount, in order: `init.<name>`, `initialed.<name>`, `load.<name>`, `loaded.<name>`, `render.<name>`, then the component's own setup, then `rendered.<name>`. On unmount: `destroy.<name>`, cleanup, `destroyed.<name>`. Methods the plugin assigns on its export object (`next`, `prev`) become `defineExpose`, each with a one-line comment.
4. **Model file.** Add `client/src/components/<name>Model.ts`: the TypeScript interface and a `<name>Mock` used only by Storybook. Comment each field.
5. **Component.** `client/src/components/<Name>.vue` takes one prop, `model`. Bind the template from `model`. The root class stays in the template (`header`, `slider`). Extra classes and flags are fields (`className`, `sticky`). Watch a field when Storybook must be able to change it after mount (`initialIndex`).
6. **Story.** `client/src/components/<Name>.stories.ts` sets `tags: ['autodocs']`. One Controls arg per model field, with a description. `render` builds `model` from those args. Do not pass exposed methods in as props.
7. **Methods.** Add a Controls row for each `defineExpose` method (see **Exposed method controls**). Do not pass those methods as props. Do not put method buttons on the canvas.
8. **Catalog.** In `client/src/components/pluginCatalog.ts`, set that component's `status` to `vue`.

## Events

Two channels, one bus. Do not add a second event system.

**Lifecycle.** Every converted component calls `emitPhase` from `client/src/components/emitPhase.ts`. That helper calls `emit` in `client/js/core/event.js`. The name is `${phase}.${componentName}`. The payload is the root element. Header emits `init.header`. Slider emits `init.slider`. `Plugin.emitPhase` in `client/js/core/plugin.js` emits the same names for the old plugins.

On mount, in order: `init`, `initialed`, `load`, `loaded`, `render`, then the component's own setup, then `rendered`. On unmount: `destroy`, then cleanup, then `destroyed`.

**Behavior.** Add these only when the plugin or the UI changes something a caller needs to observe (open/close, index change, value change). Name the pair for the moment the change starts (`change`) and the moment it has finished (`changed`): `name` before the state changes, `named` after. The payload includes the value the caller needs. Also emit the bus name `${event}.${componentName}` so existing `on()` listeners can subscribe.

Slider is the worked example. `go()` in `client/src/components/Slider.vue` does the pair. Before the index updates it emits bus `change.slider` with `[element, index]` (the frame being shown) and Vue `change` with that index. After the frame updates it emits bus `changed.slider` with `[element, current index]` and Vue `changed` with that index. `next()` and `prev()` return that index.

Declare the Vue events with `defineEmits`. Put a JSDoc comment on each key so Storybook docgen (`vue-component-meta` in `.storybook/main.ts`) lists them under events. In the story `argTypes`, describe `change` and `changed` with `table.category` `events` and no control. Do not add a radio control for an event.

## What goes on the model

If a value can change per page or per story, it is a field.

- Content from the data builder: menu items, search config, image URLs.
- Markup options: `className`, `sticky: 'true' | 'false'`. `sticky === 'true'` adds the `sticky` class.
- Optional blocks: omit `search` and the header does not render the search field. An empty `images` list renders nothing.

Leave off the model:

- Runtime state (menu open, scroll lock, `header-close`, the current slide index after the user moves it).
- Hooks for a different component (`data-role="autocomplete"`, `data-role="theme"` on the logo).

## CSS

One global file for the app and Storybook. Do not add CSS per Vue component.

`client/scss/index.scss` forwards `_theme.default.scss` and `base.scss`. The page loads that bundle once: `server/ejs/html_above.ejs` emits one `meta.css` link and sets `<body id="body">`. Storybook imports the same file in `.storybook/preview.ts` and sets `document.body.id` to `body`, because color classes such as `.major` are `#body .major`.

## Storybook

`.storybook/main.ts` registers `@storybook/addon-docs`, sets `docs.autodocs` to `tag`, and uses `docgen: 'vue-component-meta'`. `.storybook/manager.ts` opens the addon panel. Controls is the bottom bar (`A` toggles it). **Components / Name / Docs** shows the same field rows and method rows.

`npm run storybook` sets `LAUNCH_EDITOR` to `scripts/open-cursor.sh`. The `cursor` command on PATH is the agent CLI and cannot open a file.

### Show code

`.storybook/preview.ts` sets `parameters.docs.codePanel` so the canvas [code panel](https://storybook.js.org/docs/writing-docs/code-panel) uses the same snippet as the Docs source block. `docs.source` is `type: 'dynamic'` and `format: false` (Prettier escapes Vue markup). Language stays `html`. One `transform` prints a usage example:

- A story template that contains `v-model` prints that tag with the `model` arg on `v-model` and the other Controls fields as attributes. Objects and arrays use a bound attribute (`:data`). Skip `exposed`, `events`, `table.disable`, and functions.
- A story whose `model` arg is `table.disable` prints `<Name :model="{ ... }" />`. The object is the other Controls fields.
- Any other story prints the `template` string returned by its `render` function (directives).

Do not add a per-story `source.code` snippet. Example for a component:

```html
<Shifter :model='{
  "items": ["Item 1"],
  "step": 1,
  "className": ""
}' />
```

### Exposed method controls

Storybook has no button control. A radio cannot fire the same value twice. Use a **number** arg as a call trigger.

1. Name the arg after the exposed method (`next`, `prev`). Type it as `number`, not as the function.
2. `argTypes`: `control: 'number'`, `table.category` `'exposed'`, `table.type.summary` the real signature (`'() => number'`). Describe what the method does and that changing the control calls it.
3. Default `args` to `0`.
4. In `render`, `ref` the component. `watch` that arg (not `immediate`) and call `slider.value?.next()` / `prev()`. Do not bind the arg onto `model` or as a Vue prop.
5. Canvas template is only the component. No next/prev links in `#storybook-root`.

Worked example: `client/src/components/Slider.stories.ts`.

### Pure CSS class docs

A pure class has no Vue component, no model file, and no directive. The story is the property. Styles stay in the existing `client/scss` file. Do not add a stylesheet for the story.

- File: `client/src/components/<Name>.stories.ts`. `title` is `CSS/<Name>`. `tags: ['autodocs']`.
- `parameters.docs.description.component` is a short description, then a markdown table. Columns are `Class` and `What it does`. One row per class in that stylesheet, including classes that are not a control.
- One Controls arg per group of classes that cannot be combined (`xs` columns, horizontal alignment). `control` is `{ type: 'inline-radio' }` so the options sit in a row and wrap. `options` includes `''` labeled `none` so the group can be cleared. Other labels are the class names.
- `render` puts the base class on the root (`grid`, `flex`) and adds the selected classes from the args. The canvas is that markup. Twelve numbered children, each `height: 50px`, is the layout property.
- Do not set per-story `docs.source.code`. Show code is the story template.

Worked examples: `client/src/components/Grid.stories.ts`, `client/src/components/Flex.stories.ts`.

## Header

| Piece | Path |
| --- | --- |
| EJS | `server/ejs/comp_header.ejs` |
| Plugin | `client/js/plugins/_header.js` |
| Data | `server/ejs/comp_header.js` `getHeaderData` |
| Model | `client/src/components/headerModel.ts` |
| Vue | `client/src/components/Header.vue` |
| Story | `client/src/components/Header.stories.ts` |

`HeaderUiModel`: optional `search`, `menu` (`{ text, href, children? }`), `sticky`, `className` (for example `major active`). Overlay and the menu button toggle `body-expand-header` and lock scroll below 640px. One submenu is open at a time. Scroll down adds `header-close`.

## Slider

| Piece | Path |
| --- | --- |
| EJS | `server/ejs/comp_album.ejs` |
| Plugin | `client/js/plugins/_slider.js` (`next`, `prev`) |
| Model | `client/src/components/sliderModel.ts` |
| Vue | `client/src/components/Slider.vue` |
| Story | `client/src/components/Slider.stories.ts` |

`sliderMock.images` is `/images/01.jpg` through `/images/07.jpg` from `client/pages/document/index.html`. Drag calls `preventDefault`. Changing `initialIndex` in Controls moves the current frame. `next()` and `prev()` emit `change.slider` with `[element, index]` before the frame updates, then `changed.slider` with the same index after it updates, and both methods return that index. The Docs/Controls `next` and `prev` number fields call those methods.

## Shifter

| Piece | Path |
| --- | --- |
| Markup | `client/pages/document/index.html` (no `comp_shifter.ejs`) |
| Plugin | `client/js/plugins/_shifter.js` (`next`, `prev`, `data-step`) |
| Model | `client/src/components/shifterModel.ts` |
| Vue | `client/src/components/Shifter.vue` |
| Story | `client/src/components/Shifter.stories.ts` |

`shifterMock.items` matches the document property (`Item 1`–`Item 10`). `step` greater than 0 moves that many cards; otherwise the visible scroller width. Empty `items` renders nothing. Root classes `hidden-prev` / `hidden-next` are runtime, not model fields. No behavior `change` / `changed` events (the plugin did not emit them).

## Directive

A directive is for behavior on markup that already exists. No `*Model.ts`, no `.vue` file, no `defineExpose`, no lifecycle `emitPhase`.

- File: `client/src/directives/<name>.ts`.
- Register with `app.directive` from `client/src/app.ts` and from the Storybook setup.
- `binding.value` is the main input. `binding.arg` and `binding.modifiers` are the flags.
- Remove listeners when the element is unmounted.
- Behavior events that the plugin already fires still go out on the bus as `${event}.${name}`. Do not add events the plugin never fired.
- Story canvas is the existing HTML plus the directive. No model Controls.
- Docs page has an **Input** table. Show code is the story `template`, from the shared preview transform.
- Catalog `status` is `vue`.

### Directive docs

`parameters.docs.description.component` is a markdown table under `## Input`. Columns are `Slot` and `What you provide`. Worked example: `client/src/directives/tooltip.stories.ts`.

| Slot | What you provide |
| --- | --- |
| Value | What `binding.value` is. |
| modifier `<name>` | One row per modifier group. Say what it does, the default, then the markup example (`v-tooltip.once`). |
| Markup | Where the directive sits, and any required surrounding markup. |

Leave out a slot that is unused. Do not add an Argument row when `binding.arg` is unused. Do not put every modifier in one cell. Group related flags on one row (`modifier trigger`, `modifier placement`) and list each example (`v-tooltip.hover`, `v-tooltip.click`, `v-tooltip.focus`).

Only Tooltip creates one shared node under `body`. Collapse and Tab do not. Pages keep the old plugins until a later swap. Layout and LayoutToggle stay plugins.

## Collapse

Directive. Source: `client/js/plugins/_collapse.js`. Markup: `client/pages/document/index.html`.

`v-collapse:[shown]="selector"`. Example: `<button v-collapse:shown="'#caretPanel1'">`. The value is the panel selector. The argument `shown` starts open. A click toggles class `shown` on the button and the panel. Events: `show` / `shown` and `hide` / `hidden`. The payload is the trigger element. `show`, `hide`, and `toggle` stay inside the directive.

## Tab

Directive. Source: `client/js/plugins/_tab.js`. Markup: `client/pages/document/index.html`.

`v-tab="index"` on the bar that contains `[data-target]` buttons. Panels stay in the page with `data-id`. The value is the initial index (default `0`). A click on the active tab does nothing. Events: none.

## Validation

Directive. Source: `client/js/plugins/_validate.js`. Markup: `client/pages/document/index.html`.

`v-validation="'required|email'"` on the `input`, `textarea`, or `select`. Rules are `required`, `email`, `phone`, `zipcode`, and `price`, separated by `|`. A `change` runs the checks. Failure adds `has-error` and `data-tooltip` on the closest `.input`, `.checkbox`, `.radio`, `.textarea`, or `.selectbox`. A pass adds `has-success` when the field is required or has a value. Events: none.

## Form

Directive. Source: `client/js/plugins/_form.js`. Markup: `client/pages/document/index.html`.

`v-form="submit"` on the `<form>`. Submit validates every `v-validation` field first. A failure focuses the first invalid control and does not call `submit`. A pass calls `submit` with the collected fields: named text, textarea, and select values, `.checkbox` groups, and `.radio` groups. Events: none.

## Textbox

Component. Source: `client/js/plugins/_textbox.js`. Styles: `.textbox` in `client/scss/_textbox.scss`.

`<Textbox v-model="value" type="input" />` or `type="textarea"`. Root is `div.textbox`. `input` renders `div.input > input`. `textarea` renders `div.textarea > textarea`. Optional `label` is the floating label. Class `focus` is on while the field is focused or the value is not empty.

## Tooltip

Directive with one shared `div.tooltip` under `body`. Source: `client/js/plugins/_tooltip.js`.

`v-tooltip.once.[hover|click|focus].[top|bottom|left|right]="content"`. The value is the tip content. `once` shows and hides one time, then that trigger stops listening. Omit `once` to keep listening. One trigger modifier (`hover` default). One placement modifier (`top` default). Events: `show` / `shown` and `hide` / `hidden`. The payload is the trigger element. There is no second tip node.

## Player

Component, same shape as Slider. Source: `client/js/plugins/_player.js`.

| Piece | Path |
| --- | --- |
| Markup | `client/pages/document/index.html` |
| Plugin | `client/js/plugins/_player.js` (`goTo`, `goNext`, `goPrev`, `play`, `pause`, `toggle`) |
| Model | `client/src/components/playerModel.ts` |
| Vue | `client/src/components/Player.vue` |
| Story | `client/src/components/Player.stories.ts` |

One prop, `model`. The root class `player` stays in the template. Model fields follow Slider naming where they match: `images`, `initialIndex` (plugin `imgIndex`), `showProcess`, `className`, plus Player-only `showControl`, `autoPlay`, `animationDuration`, `direction` (initial only). The image mock is `/images/01.jpg` through `/images/07.jpg`. `animationDuration` sets `--player-animation-duration`. `autoPlay` true starts with class `playing` (the plugin lists this flag and never reads it).

Expose `goTo`, `goNext`, `goPrev`, `play`, `pause`, `toggle`. Story number triggers follow Slider `next` / `prev`. Index changes emit `change` / `changed` the way Slider `go()` does. The payload is the index. The bus names are `change.player` / `changed.player`. Also keep `player.play` and `player.pause` with payload `[element]`.

## GroupDropdown

Component. Source: `server/ejs/comp_filter.ejs` and `client/js/plugins/_groupdropdown.js`. Styles stay in `client/scss/_groupdropdown.scss`.

```html
<GroupDropdown v-model="obj" :data="configure" @change @input @open @close />
```

`data` is the field list from `createFilterComponent().data.fields`. `v-model` is keyed by field id. Range is `[min, max]` (`''` is unbounded). `single` is one string. `multi` and `tags` are checked values. The story mock is the empty listing filter (price, bed, bath, type, status, tags).

Expose `open(id)` and `close()`. `input` fires while a control changes. `change` fires on reset or when the list closes. `open` carries the field id. `close` fires after the fly-out. Bus names are `input.groupdropdown`, `change.groupdropdown`, `open.groupdropdown`, and `close.groupdropdown`. Lifecycle uses `emitPhase`.

## Form enum input

One interface for Radio, Checkbox, Select, RangeSlider, DropdownRadio, and DropdownCheckbox. Markup classes already exist (`.radio`, `.checkbox`, `.selectbox`, `.range-slider`). No new CSS.

```vue
<Radio v-model="model" :data="options" />
```

```ts
options = [{ value: string, text: string }, ...]
```

`data` is the only options prop. `value` is the submitted value. `text` is the visible label. Input ids are generated inside the component.

`v-model` is the selection. Radio, Select, and DropdownRadio store one `value` string. Checkbox and DropdownCheckbox store a `value` string array. RangeSlider stores `[minValue, maxValue]`, the two option `value`s at the ends of the fill. An empty string is the unchecked or unselected state.

Radio and Checkbox markup matches `client/pages/document/index.html` (gender radios, favor checkboxes): a label, then `.radio` or `.checkbox`, then `label > input + span`. Select matches the `.selectbox` block (label, `select`, `icon-angle-down`).

DropdownRadio and DropdownCheckbox use that same choice markup inside a closed list that opens from a button. There is no separate plugin file.

RangeSlider stays a component and keeps the drag, fill, price formatting, bubbling `input` / `change`, and inbound `reset` from `client/js/plugins/_rangeslider.js`. Stops are `data` entries (`no_min` / `no_max` are `value`s; `text` is the label). `format: 'price' | ''` is the one extra prop beside `v-model` and `data`. Expose `get()` as `{ min, max }`. Vue `change` / `changed` carry that pair.

Each of the six gets a model file only for the shared option type and a mock, a `.vue` file, and a story whose Controls are `model` and `data`.

| Piece | Path |
| --- | --- |
| Radio markup | `client/pages/document/index.html` (Select Gender) |
| Checkbox markup | `client/pages/document/index.html` (Select Favor) |
| Select markup | `client/pages/document/index.html` (`.selectbox`) |
| RangeSlider plugin | `client/js/plugins/_rangeslider.js` |
| Shared option type | `client/src/components/formEnumOption.ts` |
| Vue | `client/src/components/<Name>.vue` |
| Story | `client/src/components/<Name>.stories.ts` |

## Check

Run `npm run storybook`. Header: open and close the menu, expand one submenu, scroll so `header-close` appears. Slider: change a Controls field, then change the `next` and `prev` controls more than once. Shifter: prev arrow hidden at the start; click next; change the `next` and `prev` controls more than once. Docs Show code is `<Name :model="{ ... }" />` or a `v-model` tag for components, and the story template for directives.

Collapse and Tab: click the real markup. Textbox: focus, type, and blur. Tooltip: hover, click, and `once`. Player: Controls plus `goNext` / `play` more than once. Each form enum input: change `data`, then change the selection so `v-model` updates. RangeSlider: drag, release, and `get()`.
