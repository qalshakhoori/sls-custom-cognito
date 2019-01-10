const AWS = require('aws-sdk');
const { sendCFNResponse } = require('./SLS');

module.exports.handler = async (event) => {
    try {
        switch (event.RequestType) {
            case 'Create':
            case 'Update':
                var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

                await cognitoIdentityServiceProvider.updateUserPoolClient({
                    UserPoolId: event.ResourceProperties.UserPoolId,
                    ClientId: event.ResourceProperties.UserPoolClientId,
                    SupportedIdentityProviders: event.ResourceProperties.SupportedIdentityProviders,
                    CallbackURLs: [event.ResourceProperties.CallbackURL],
                    LogoutURLs: [event.ResourceProperties.LogoutURL],
                    AllowedOAuthFlowsUserPoolClient: (event.ResourceProperties.AllowedOAuthFlowsUserPoolClient == 'true'),
                    AllowedOAuthFlows: event.ResourceProperties.AllowedOAuthFlows,
                    AllowedOAuthScopes: event.ResourceProperties.AllowedOAuthScopes
                }).promise();

                await sendCFNResponse(event, 'SUCCESS');
                break;

            case 'Delete':
                await sendCFNResponse(event, 'SUCCESS');
                break;
        }

        console.info(`CognitoUserPoolClientSettings Success for request type ${event.RequestType}`);
    } catch (error) {
        console.error(`CognitoUserPoolClientSettings Error for request type ${event.RequestType}:`, error);
        await sendCFNResponse(event, 'FAILED');
    }
}

/*async function sendCFNResponse(event, responseStatus, responseData) {
    var params = {
        FunctionName: getSLSFunctionName('CFNSendResponse'),
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
}*/