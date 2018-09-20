const baseController = require('../common/controllers/basecontroller');
const docModel = require('../common/models/basemodel');
class Car extends baseController {
    constructor(req, res) {
        super(req, res);
        //var data= getDataFromServer(req);
        this.model = new docModel(req);
    }
    render(req, res) {
        
    }
}
