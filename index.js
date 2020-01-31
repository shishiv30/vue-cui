const resolve = file => path.resolve(__dirname, file);
const {getContextByReq} = require('./src/common/mapping/context/server');
const LRU = require('lru-cache');
const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const { createBundleRenderer } = require('vue-server-renderer');
const serverBundle = require('./public/vue-ssr-server-bundle.json');
const clientManifest = require('./public/vue-ssr-client-manifest.json');
const templatePath = resolve('./src/app.template.html');
const isDev = process.env.NODE_ENV !== 'production';

function createRenderer (bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        runInNewContext: false
    }));
}


let renderer;
let readyPromise;

const template = fs.readFileSync(templatePath, 'utf-8');
const bundle = require('./public/vue-ssr-server-bundle.json');
renderer = createRenderer(bundle, {
    template,
    clientManifest
});

function render (req, res, next) {
    var isResource = /\.\w+$/.test(req.url);
    res.setHeader('Content-Type', 'text/html');
    const handleError = err => {
        if (err.url) {
            res.redirect(err.url);
        } else if(err.code === 404) {
            res.status(404).send('404 | Page Not Found');
        } else {
        // Render Error Page or Redirect
            res.status(500).send('500 | Internal Server Error');
            console.error(`error during render : ${req.url}`);
            console.error(err.stack);
        }
    };
    const context = getContextByReq(req);
    if (!isResource && context.userAgent.isBot) {
        renderer.renderToString(context, (err, html) => {
            if (err) {
                return handleError(err);
            }
            res.send(html);
        });
    }else{
        next();
    }
}

app.get('*', render);

app.use(express.static('public'));

app.listen(8088, () => console.log('App listening on http://localhost:8088 '));