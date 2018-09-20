function updateViewport(state, viewport) {
    Object.assign(state.viewport, viewport);
}
function updateUrls(state, urls){
    Object.assign(state.urls, urls);
}
function inital(state, data){
    state = data;
}
export default {
    updateViewport,
    updateUrls,
    inital
}
