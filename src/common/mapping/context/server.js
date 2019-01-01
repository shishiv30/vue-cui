var MobileDetect = require('mobile-detect');
var Negotiator = require('negotiator');

function getContextByReq (req) {
    var ua = req.headers['user-agent'];
    var md = new MobileDetect(ua);
    var negotiator = new Negotiator(req);
    var context = {
        userAgent: {
            isBot: md && md.is('bot'),
            phone: md && md.phone(),
            tablet: md && md.tablet()
        },
        urls: {
            referUrl: req.headers['referer'],
            currentUrl: req.url,
            domain: req.get('host')
        },
        location: {
            language: negotiator.languages()
        }
    };
    context.userAgent.isPhone = !!context.userAgent.phone;
    context.userAgent.isTablet = !!context.userAgent.tablet;
    context.userAgent.isDesktop = !context.userAgent.isPhone && !context.userAgent.isTablet;
    return context;
}

module.exports = {
    getContextByReq
};
