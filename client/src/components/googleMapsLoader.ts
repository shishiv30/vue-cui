const CALLBACK = '__googleMapsLoaded';

type MapsWindow = Window & {
	google?: typeof google;
	[CALLBACK]?: () => void;
};

let loading: Promise<void> | null = null;

/**
 * Injects the Maps JavaScript API once per page.
 * With `loading=async`, the script `load` event fires before `google.maps.importLibrary` exists.
 * The `callback` parameter is the signal that the API is ready.
 */
export function loadGoogleMaps(apiKey: string): Promise<void> {
	if (typeof window === 'undefined') {
		return Promise.reject(new Error('Google Maps needs a browser.'));
	}
	const mapsWindow = window as MapsWindow;
	if (typeof mapsWindow.google?.maps?.importLibrary === 'function') {
		return Promise.resolve();
	}
	if (!apiKey) {
		return Promise.reject(new Error('Google Maps needs an apiKey.'));
	}
	loading ??= new Promise<void>((resolve, reject) => {
		mapsWindow[CALLBACK] = () => {
			delete mapsWindow[CALLBACK];
			if (typeof mapsWindow.google?.maps?.importLibrary === 'function') {
				resolve();
				return;
			}
			loading = null;
			reject(new Error('Google Maps loaded without importLibrary.'));
		};
		const script = document.createElement('script');
		const params = new URLSearchParams({
			key: apiKey,
			v: 'weekly',
			loading: 'async',
			callback: CALLBACK,
		});
		script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
		script.async = true;
		script.onerror = () => {
			loading = null;
			delete mapsWindow[CALLBACK];
			script.remove();
			reject(new Error('Google Maps script failed to load. Check the apiKey and network.'));
		};
		document.head.append(script);
	});
	return loading;
}
