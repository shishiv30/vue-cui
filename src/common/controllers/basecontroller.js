const fs = require('fs');
const vrenderer = require('vue-server-renderer');
const path = require('path');
const templatePath = path.resolve(__dirname, '..', 'templates', 'index.template.html');
const { createBundleRenderer } = require('vue-server-renderer');
const renderer = createBundleRenderer(require('../../serverbundles/build/vue-ssr-server-bundle.json'), {
    template: fs.readFileSync(templatePath, 'utf-8')
});

class BaseController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    ssr(template, model){

    };
}
module.exports = BaseController;
