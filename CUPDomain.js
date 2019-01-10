const AWS = require('aws-sdk');
const { sendCFNResponse } = require('./SLS');

module.exports.handler = async (event) => {
    try {
        var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

        switch (event.RequestType) {
            case 'Create':
                await cognitoIdentityServiceProvider.createUserPoolDomain({
                    UserPoolId: event.ResourceProperties.UserPoolId,
                    Domain: event.ResourceProperties.Domain
                }).promise();
                break;

            case 'Update':
                await deleteUserPoolDomain(cognitoIdentityServiceProvider, event.OldResourceProperties.Domain);

                await cognitoIdentityServiceProvider.createUserPoolDomain({
                    UserPoolId: event.ResourceProperties.UserPoolId,
                    Domain: event.ResourceProperties.Domain
                }).promise();
                break;

            case 'Delete':
                await deleteUserPoolDomain(cognitoIdentityServiceProvider, event.ResourceProperties.Domain);
                break;
        }

        await sendCFNResponse(event, 'SUCCESS');
        console.info(`CognitoUserPoolDomain Success for request type ${event.RequestType}`);
    } catch (error) {
        console.error(`CognitoUserPoolDomain Error for request type ${event.RequestType}:`, error);
        await sendCFNResponse(event, 'FAILED');
    }
}

async function deleteUserPoolDomain(cognitoIdentityServiceProvider, domain) {
    var response = await cognitoIdentityServiceProvider.describeUserPoolDomain({
        Domain: domain
    }).promise();

    if (response.DomainDescription.Domain) {
        await cognitoIdentityServiceProvider.deleteUserPoolDomain({
            UserPoolId: response.DomainDescription.UserPoolId,
            Domain: domain
        }).promise();
    }
}