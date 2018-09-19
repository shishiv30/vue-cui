class BaseController {
    constructor(req, res, model) {
        this.req = req;
        this.res = res;
        this.model = model
    }
}
module.exports =   BaseController;
