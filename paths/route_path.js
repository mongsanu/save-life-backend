const { error4o4Controller, error500Controller, error401Controller } = require('../api/controllers/error_controller/error_controller.js');
const rootPath = require("./routes/root");

const all_paths = [
    require('./routes/root'),
    require('./routes/signup-login'),
    require('./routes/user'),
    require('./routes/request'),
];

// module.exports = all_paths;
module.exports = (app) => {
    app.use(rootPath);
    all_paths.map(path => app.use('/api', path));
    app.use(error4o4Controller);
    app.use(error500Controller);
    app.use(error401Controller);
}
