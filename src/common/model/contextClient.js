var MobileDetect = require('mobile-detect');
var Negotiator = require('negotiator');
function createStateByReq() {
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
function createTitleByReq(req) {
    return 'CUI VUE';
}
function createMetaByReq(req){
    return `
        <meta http-equiv="Cache-control" content="public">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta content='width=device-width, initial-scale=1.0' name='viewport'/>
        <meta description='a UI solution base on vue and cui' />
        <meta name="Description" content="Author: Conjee Zou, UI solution, Category: Document, Lisence: MIT">
        <meta name="background-color" content="#ffffff">
        <meta name="theme-color" content="#333333">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon">
    `;
}
module.exports = req=>{
    return {
        state:createStateByReq(req),
        title:createTitleByReq(req),
        meta:createMetaByReq(req)
    }
};
