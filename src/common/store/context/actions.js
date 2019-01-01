function updateContext (commit, data) {
    commit('updateUserAgent', data.userAgent);
    commit('updateUrls', data.urls);
    commit('updateLocation', data.location);
    commit('updateViewport', data.viewport);
}
export default {
    updateContext
};
