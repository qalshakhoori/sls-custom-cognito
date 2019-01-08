const { serviceName, stage } = require('./config.json');

module.exports.getSLSFunctionName = (FunctionName) => {
    return `${serviceName}-${stage}-${FunctionName}`;
}