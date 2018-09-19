var MobileDetect = require('mobile-detect');
var moment = require('moment');

class BaseModel {
    constructor(req) {
        var ua = req.headers['user-agent'];
        var md = new MobileDetect(ua);
        this.useragent = useragent.parse(ua);
        this.device = {
            isBot: md && md.is('bot'),
            phone: md && md.phone(),
            tablet: md && md.tablet(),
            isMobile: md && md.mobile(),
            userAgent :md && md.userAgents(),
        };
        this.device.isPhone = !!this.device.phone;
        this.device.isTablet = !!this.device.tablet;
        this.device.isDesktop = !this.device.isPhone && !!this.device.isTablet;
         
        this.url = {
            referUrl: browser.referUrl,
            appUrl: '',
            cdnUrl: ''
        };
        this.location = {
            language
        };
        this.userInfo = {
            userId: null,
            isLogin: false
        };
    }

}
module.exports = BaseModel;

var md = null;
var ua = req.headers['user-agent'];
if (req && ua)
    md = new MobileDetect(ua);
var enablemobilesplit = config.server.enableDesktopSplit != undefined
    ? config.server.enableDesktopSplit
    : false;
if (typeof enablemobilesplit == "string") {
    if (enablemobilesplit == "true")
        enablemobilesplit = true;
    else
        enablemobilesplit = false;
    }
var language = "en";
if (req && req.acceptsLanguages() && req.acceptsLanguages().length) {
    var first = req.acceptsLanguages()[0];
    if (first == "es" || first.indexOf("es-") >= 0)
        language = "es";
    else
        language = first;
    }
var isMobile = true;
let apiRoutesArray = ['/api/context', '/api/dosearch/'];
if (req.path.indexOf('/api/') == 0 && !apiRoutesArray.includes(req.path)) {
    isMobile = false || !enablemobilesplit;
} else {
    isMobile = (
        md
        ? md.mobile() != null
        : false) || !enablemobilesplit;
}
var sessionFactory = new SessionFactory(req);
if (sessionFactory.getSessionObject(sessionFactory.sessionType.FULLPAGE)) {
    isMobile = false;
}
var browser = {
    isMobile: isMobile,
    isGoogleApp: ua && ua.indexOf('GSA') > -1,
    isPhone: md
        ? !!md.phone()
        : false,
    isTablet: md
        ? !!md.tablet()
        : false,
    isTouchDevice: md
        ? md.mobile() != null
        : false,
    userAgent: req
        ? req.headers['user-agent']
        : '',
    OS: (md && md.mobile() != null)
        ? md.os()
        : 'Desktop',
    language: language,
    isUserBrowser: namespace.checkIsBrowser(req),
    requestUrlRaw: req.url,
    referUrl: (req && req.headers && req.headers.referer)
        ? req.headers.referer
        : '',
    userId: namespace.getUserId(req),
    randomId: namespace.getRandomId(req, res),
    session: req.session,
    cookies: req.cookies,
    webSiteType: req.webSiteType,
    flat: req.query && req.query.flat
        ? req.query.flat
        : ''
        // req: req,
        // res: res
};
if (!browser.isPhone && browser.isTouchDevice && !browser.isTablet) {
    // fix for isPhone flag. if it is touch device but not a tablet, it is a phone.
    browser.isPhone = true;
}
return browser;
