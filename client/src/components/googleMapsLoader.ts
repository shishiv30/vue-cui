let loading: Promise<void> | null = null;

/** Injects the Google Maps bootstrap loader once per page; later calls share the same promise. */
export function loadGoogleMaps(apiKey: string): Promise<void> {
	if (typeof window === 'undefined') {
		return Promise.reject(new Error('Google Maps needs a browser.'));
	}
	if (typeof window.google?.maps?.importLibrary === 'function') {
		return Promise.resolve();
	}
	if (!apiKey) {
		return Promise.reject(new Error('Google Maps needs an apiKey.'));
	}
	loading ??= new Promise<void>((resolve, reject) => {
		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&loading=async&libraries=maps,marker`;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => {
			loading = null;
			script.remove();
			reject(new Error('Google Maps script failed to load. Check the apiKey and network.'));
		};
		document.head.append(script);
	});
	return loading;
}
