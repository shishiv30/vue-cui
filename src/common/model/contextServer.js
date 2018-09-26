var MobileDetect = require('mobile-detect');
var Negotiator = require('negotiator');
function createStateByReq(req) {
    var ua = req.headers['user-agent'];
    var lang = req.headers["accept-language"]
    var md = new MobileDetect(ua);
    var negotiator = new Negotiator(req)
    var state = {
        userAgent: {
            isBot: md && md.is('bot'),
            phone: md && md.phone(),
            tablet: md && md.tablet(),
            isMobile: md && md.mobile()
        },
        urls: {
            referUrl: req.headers['referer'],
            currentUrl: req.url,
            domain: req.get('host')
        },
        location: {
            language: negotiator.languages()
        },
        viewport: {
            width: 375,
            height: 667,
            xsScreen: 639,
            smScreen: 991,
            mdScreen: 1399,
            scrollTop: 0,
            scrollLeft: 0
        }
    };
    state.userAgent.isPhone = !!state.userAgent.phone;
    state.userAgent.isTablet = !!state.userAgent.tablet;
    state.userAgent.isDesktop = !state.userAgent.isPhone && !state.userAgent.isTablet;
    return state;
};

module.exports = req => {
    return {state: createStateByReq(req)}
};
