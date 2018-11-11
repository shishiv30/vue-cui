function updateViewport (state, viewport) {
    Object.assign(state.viewport, viewport);
}

function updateUrls (state, urls) {
    Object.assign(state.urls, urls);
}

function updateUserAgent (state, userAgent) {
    Object.assign(state.userAgent, userAgent);
}

function updateLocation (state, location) {
    Object.assign(state.location, location);
}
export default {
    updateViewport,
    updateUrls,
    updateUserAgent,
    updateLocation
};
