const baseController = require('../common/controllers/basecontroller');
const VSearchModel = require('./models/vSearchModel');
class DocModel extends BaseModel {
    constructor(req, data) {
        super(req);
    }

    loadView(req, res, oldSearchModel) {
        let options = this.initialize(req, res);
        const searchModel = new VSearchModel(oldSearchModel, options);
        this.renderPage(searchModel);
    }
}

module.exports = DocModel;
