const { CognitoIdentityServiceProvider } = require('aws-sdk');
const { sendCFNResponse } = require('./SLS');

module.exports.handler = async (event) => {
    try {
        const cognitoISP = new CognitoIdentityServiceProvider();

        switch (event.RequestType) {
            case 'Create':
                await cognitoISP.createIdentityProvider({
                    UserPoolId: event.ResourceProperties.UserPoolId,
                    ProviderName: event.ResourceProperties.ProviderName,
                    ProviderType: event.ResourceProperties.ProviderType,
                    ProviderDetails: {
                        attributes_url: event.ResourceProperties.Attributes_url,
                        attributes_url_add_attributes: event.ResourceProperties.Attributes_url_add_attributes,
                        authorize_scopes: event.ResourceProperties.Authorize_scopes,
                        authorize_url: event.ResourceProperties.Authorize_url,
                        client_id: event.ResourceProperties.Client_id,
                        client_secret: event.ResourceProperties.Client_secret,
                        token_request_method: event.ResourceProperties.Token_request_method,
                        token_url: event.ResourceProperties.Token_url
                    }
                }).promise();
                break;

            case 'Update':
                await cognitoISP.updateIdentityProvider({
                    UserPoolId: event.ResourceProperties.UserPoolId,
                    ProviderName: event.ResourceProperties.ProviderName,
                    ProviderDetails: {
                        attributes_url: event.ResourceProperties.Attributes_url,
                        attributes_url_add_attributes: event.ResourceProperties.Attributes_url_add_attributes,
                        authorize_scopes: event.ResourceProperties.Authorize_scopes,
                        authorize_url: event.ResourceProperties.Authorize_url,
                        client_id: event.ResourceProperties.Client_id,
                        client_secret: event.ResourceProperties.Client_secret,
                        token_request_method: event.ResourceProperties.Token_request_method,
                        token_url: event.ResourceProperties.Token_url
                    }
                }).promise();
                break;

            case 'Delete':
                await cognitoISP.deleteIdentityProvider({
                    UserPoolId: event.ResourceProperties.UserPoolId,
                    ProviderName: event.ResourceProperties.ProviderName
                }).promise();
                break;
        }

        await sendCFNResponse(event, 'SUCCESS');
        console.info(`CognitoIdentityProvider Success for request type ${event.RequestType}`);
    } catch (error) {
        console.error(`CognitoIdentityProvider Error for request type ${event.RequestType}:`, error);
        await sendCFNResponse(event, 'FAILED');
    }
}