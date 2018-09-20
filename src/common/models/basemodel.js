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
        this.session: req.session;
        this.cookies: req.cookies;
        this.urls = {
            referUrl: browser.referUrl,
            currentUrl: req.url,
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
