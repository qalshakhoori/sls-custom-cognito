const { CognitoIdentityServiceProvider } = require('aws-sdk');
const sendCFNResponse = require('./CFNSendResponse');

module.exports.handler = async (event) => {
    try {
        const cognitoISP = new CognitoIdentityServiceProvider();
        const {
            UserPoolId,
            ProviderName,
            ProviderType,
            Attributes_url,
            Attributes_url_add_attributes,
            Authorize_scopes,
            Authorize_url,
            Client_id,
            Client_secret,
            Token_request_method,
            Token_url
        } = event.ResourceProperties;
        switch (event.RequestType) {
            case 'Create':
                await cognitoISP.createIdentityProvider({
                    UserPoolId,
                    ProviderName,
                    ProviderType,
                    ProviderDetails: {
                        attributes_url: Attributes_url,
                        attributes_url_add_attributes: Attributes_url_add_attributes,
                        authorize_scopes: Authorize_scopes,
                        authorize_url: Authorize_url,
                        client_id: Client_id,
                        client_secret: Client_secret,
                        token_request_method: Token_request_method,
                        token_url: Token_url
                    }
                }).promise();
                break;
            case 'Update':
                await cognitoISP.updateIdentityProvider({
                    UserPoolId,
                    ProviderName,
                    ProviderDetails: {
                        attributes_url: Attributes_url,
                        attributes_url_add_attributes: Attributes_url_add_attributes,
                        authorize_scopes: Authorize_scopes,
                        authorize_url: Authorize_url,
                        client_id: Client_id,
                        client_secret: Client_secret,
                        token_request_method: Token_request_method,
                        token_url: Token_url
                    }
                }).promise();
                break;
            case 'Delete':
                await cognitoISP.deleteIdentityProvider({
                    ProviderName,
                    UserPoolId
                }).promise();
                break;
        }

        await sendCFNResponse(event, 'SUCCESS');
        console.info(`CognitoIdentityProvider Success for request type ${event.RequestType}`);
    } catch (error) {
        console.error(`CognitoIdentityProvider Error for request type ${event.RequestType}:`, error);
        await sendCFNResponse(event, 'FAILED', {}, error);
    }
}