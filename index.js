const express = require('express');
const server = express();
const fs = require('fs');
const {
    createBundleRenderer
} = require('vue-server-renderer');
var detector = require('spider-detector');
const serverBundle = require('./public/vue-ssr-server-bundle.json');
const clientManifest = require('./public/vue-ssr-client-manifest.json');
const template = fs.readFileSync('./src/app.template.html', 'utf-8');
const renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest
});
server.use(detector.middleware());
server.get('*', (req, res, next) => {
    var isResource = /\.\w+$/.test(req.url);
    //ssr only for spider
    if (!isResource && req.isSpider()) {
        renderer.renderToString(req, (err, html) => {
            if (err) {
                if (err.code === 404) {
                    res.status(404).end('Page not found');
                } else {
                    console.log(err);
                    return res.status(500).end('Internal Server Error');
                }
            } else {
                return res.end(html);
            }
        });
    } else {
        return next();
    }
});

server.use(express.static('public'));

server.listen(8088, () => console.log(`Example app listening on port ${8088}!`));