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

const ssrApp = require('/ssr.server.bundle.js')

const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createBundleRenderer('/path/to/vue-ssr-server-bundle.json',{
    template: require('fs').readFileSync('./src/app.template.html', 'utf-8')
});

server.get('*', (req, res) => {
    const data = {
        context: {
            urls: {
                currentUrl: location.href
            }
        }
    }
    ssrApp(data).then(app => {
        renderer.renderToString(app, (err, html) => {
            if (err) {
                if (err.code === 404) {
                    res.status(404).end('Page not found')
                } else {
                    res.status(500).end('Internal Server Error')
                }
            } else {
                res.end(html)
            }
        })
    })
})

server.listen(8088, () => console.log(`Example app listening on port ${ 8088}!`));
