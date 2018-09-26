// var express = require('express');
// var app = express();
// const port = 3000;
// var docController = require('./src/doc/doccontroller');
//
// function _render(controller) {
//     return function(req, res, next) {
//         var controller = new controller(req, res, next);
//         if (!controller.render) {
//             return res.send('please implement render function for the controller');
//         }
//         return controller.render();
//     };
// }
//
// app.get('/doc', _render(docController));
//
// app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const Vue = require('vue')
const server = require('express')()
const fs = require('fs');
const {createBundleRenderer} = require('vue-server-renderer')
const serverBundle = require('./dist/vue-ssr-server-bundle.json');
const template = fs.readFileSync('./src/app.template.html', 'utf-8');
var MobileDetect = require('mobile-detect');
var Negotiator = require('negotiator');
const contextServer = require('./src/common/model/contextServer');
const renderer = createBundleRenderer(serverBundle, {template: template});
server.get('*', (req, res) => {
    const context = contextServer(req);
    renderer.renderToString(context, (err, html) => {
        if (err) {
            if (err.code === 404) {
                res.status(404).end('Page not found')
            } else {
                console.log(err)
                res.status(500).end('Internal Server Error')
            }
        } else {
            res.end(html)
        }
    });
})

server.listen(8088, () => console.log(`Example app listening on port ${ 8088}!`));
