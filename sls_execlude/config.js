const editJsonFile = require('edit-json-file');

module.exports.stage = (serverless) => {
    // This file is executed within the context of serverless.yml, you need to refernce file at the same level
    let file = editJsonFile('./config.json'); 
    let { stage } = serverless.cli.serverless.providers.aws.options;
    if (!stage) {
        stage = 'dev'
    }
    file.set('stage', stage);
    file.save();
    return stage;
}