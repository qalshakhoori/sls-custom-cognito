const AWS = require('aws-sdk');
const { serviceName, stage } = require('./config.json');

async function sendCloudFormationResponse(event, responseStatus, responseData) {
    var params = {
        FunctionName: `${serviceName}-${stage}-CFNSendResponse`,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            ResponseURL: event.ResponseURL,
            ResponseStatus: responseStatus,
            ResponseData: responseData
        })
    };

    var lambda = new AWS.Lambda();
    var response = await lambda.invoke(params).promise();

    if (response.FunctionError) {
        var responseError = JSON.parse(response.Payload);
        throw new Error(responseError.errorMessage);
    }
}

module.exports.sendCFNResponse = sendCloudFormationResponse;