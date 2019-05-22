const { CognitoIdentityServiceProvider } = require('aws-sdk');
const sendCFNResponse = require('./CFNSendResponse');

module.exports.handler = async (event) => {
    try {
        const cognitoISP = new CognitoIdentityServiceProvider();
        const {
            UserPoolId,
            UserPoolClientId,
            SupportedIdentityProviders,
            CallbackURL,
            LogoutURL,
            AllowedOAuthFlowsUserPoolClient,
            AllowedOAuthFlows,
            AllowedOAuthScopes
        } = event.ResourceProperties;
        switch (event.RequestType) {
            case 'Create':
            case 'Update':
                await cognitoISP.updateUserPoolClient({
                    UserPoolId,
                    ClientId: UserPoolClientId,
                    SupportedIdentityProviders,
                    CallbackURLs: [CallbackURL],
                    LogoutURLs: [LogoutURL],
                    AllowedOAuthFlowsUserPoolClient: (AllowedOAuthFlowsUserPoolClient == 'true'),
                    AllowedOAuthFlows,
                    AllowedOAuthScopes
                }).promise();
                break;
            case 'Delete':
                break;
        }
        await sendCFNResponse(event, 'SUCCESS');
        console.info(`CognitoUserPoolClientSettings Success for request type ${event.RequestType}`);
    } catch (error) {
        console.error(`CognitoUserPoolClientSettings Error for request type ${event.RequestType}:`, error);
        await sendCFNResponse(event, 'FAILED', {}, error.message);
    }
}