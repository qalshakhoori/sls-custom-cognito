const editJsonFile = require('edit-json-file');

module.exports.stage = (serverless) => {
    let file = editJsonFile('../config.json');
    let { stage } = serverless.cli.serverless.providers.aws.options;
    if (!stage) {
        stage = 'dev'
    }
    file.set('stage', stage);
    file.save();
    return stage;
}