declare const __APP_BASE__: string;
/** GOOGLE_MAPS_API_KEY from .env.local, injected by the app build only (empty in Storybook, absent in the lib build). */
declare const __GOOGLE_MAPS_API_KEY__: string | undefined;

declare module '*.vue' {
	import type { DefineComponent } from 'vue';
	const component: DefineComponent<object, object, unknown>;
	export default component;
}
