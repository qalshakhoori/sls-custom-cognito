const { CognitoIdentityServiceProvider } = require('aws-sdk');
const { sendCFNResponse } = require('./SLS');

module.exports.handler = async (event) => {
    try {
        switch (event.RequestType) {
            case 'Create':
            case 'Update':
                const cognitoISP = new CognitoIdentityServiceProvider();

                await cognitoISP.updateUserPoolClient({
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