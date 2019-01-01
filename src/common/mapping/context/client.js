var MobileDetect = require('mobile-detect');

function getContextByWindow (req) {
    var md = new MobileDetect(navigator.userAgent);
    var context = {
        userAgent: {
            isBot: md && md.is('bot'),
            phone: md && md.phone(),
            tablet: md && md.tablet()
        },
        urls: {
            referUrl: document.referrer,
            currentUrl: document.URL,
            domain: document.location.host
        },
        location: {
            language: navigator.language
        }
    };
    context.userAgent.isPhone = !!context.userAgent.phone;
    context.userAgent.isTablet = !!context.userAgent.tablet;
    context.userAgent.isDesktop = !context.userAgent.isPhone && !context.userAgent.isTablet;
    return context;
}

module.exports = {
    getContextByWindow
};
