import {
    createApp
} from './app';
import {
    getContextByReq
} from './common/mapping/context/server';
export default req => {
    const context = getContextByReq(req);
    return new Promise((resolve, reject) => {
        const {
            app,
            router,
            store
        } = createApp(context);
        router.push('/');
        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();
            if (!matchedComponents.length) {
                return reject(new Error('no matched compoents'));
            }
            Promise.all(matchedComponents.map(Component => {
                if (Component.asyncData) {
                    return Component.asyncData({
                        store,
                        route: router.currentRoute
                    });
                }
            })).then(() => {
                // req.state will be auto inject to window.__INITIAL_STATE__
                req.state = store.state;
                resolve(app);
            }).catch(reject);
        }, reject);
    });
};
