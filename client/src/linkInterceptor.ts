import type { Router } from 'vue-router';

/**
 * Delegated click handler: plain same-origin links that match a client-side
 * route are navigated through the router, everything else keeps the browser default.
 */
export function installLinkInterceptor(router: Router, root: Document | HTMLElement = document) {
	const onClick = (event: Event) => {
		const e = event as MouseEvent;
		if (
			e.defaultPrevented
			|| e.button !== 0
			|| e.metaKey
			|| e.ctrlKey
			|| e.shiftKey
			|| e.altKey
		) {
			return;
		}
		const anchor = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
		if (
			!anchor
			|| (anchor.target && anchor.target !== '_self')
			|| anchor.hasAttribute('download')
			|| anchor.origin !== window.location.origin
		) {
			return;
		}
		const target = router.resolve(anchor.pathname + anchor.search + anchor.hash);
		if (!target.matched.length) {
			return;
		}
		e.preventDefault();
		void router.push(target);
	};
	root.addEventListener('click', onClick);
	return () => root.removeEventListener('click', onClick);
}
