const { CognitoIdentityServiceProvider } = require('aws-sdk');
const { sendCFNResponse } = require('./SLS');

module.exports.handler = async (event) => {
    try {
        const cognitoISP = new CognitoIdentityServiceProvider();

        switch (event.RequestType) {
            case 'Create':
                await cognitoISP.createUserPoolDomain({
                    UserPoolId: event.ResourceProperties.UserPoolId,
                    Domain: event.ResourceProperties.Domain
                }).promise();
                break;

            case 'Update':
                await deleteUserPoolDomain(cognitoISP, event.OldResourceProperties.Domain);

                await cognitoISP.createUserPoolDomain({
                    UserPoolId: event.ResourceProperties.UserPoolId,
                    Domain: event.ResourceProperties.Domain
                }).promise();
                break;

            case 'Delete':
                await deleteUserPoolDomain(cognitoISP, event.ResourceProperties.Domain);
                break;
        }

        await sendCFNResponse(event, 'SUCCESS');
        console.info(`CognitoUserPoolDomain Success for request type ${event.RequestType}`);
    } catch (error) {
        console.error(`CognitoUserPoolDomain Error for request type ${event.RequestType}:`, error);
        await sendCFNResponse(event, 'FAILED');
    }
}

async function deleteUserPoolDomain(cognitoISP, domain) {
    var response = await cognitoISP.describeUserPoolDomain({
        Domain: domain
    }).promise();

    if (response.DomainDescription.Domain) {
        await cognitoISP.deleteUserPoolDomain({
            UserPoolId: response.DomainDescription.UserPoolId,
            Domain: domain
        }).promise();
    }
}