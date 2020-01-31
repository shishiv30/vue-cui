import { createApp } from './app';
import { getContextByReq } from './common/mapping/context/server';
export default context => {
    return new Promise((resolve, reject) => {
        const { app, router, store} = createApp(context);
        router.push(context.urls.currentUrl);
        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();
            if (!matchedComponents.length) {
                return reject(new Error('no matched compoents'));
            }
            Promise.all(matchedComponents.map(({asyncData}) => {
                asyncData && asyncData({
                    store,
                    route: router.currentRoute
                });
            })).then(() => {
                context.state = store.state;
                resolve(app);
            }).catch(reject);
        }, reject);
    });
};
