## Cusom Cognito CloudFormation resources using serverless framework

At first I would like to thank Rosberg Linhares for his great work at [this repo](https://github.com/rosberglinhares/CloudFormationCognitoCustomResources).  
I used his work to make custom cognito resources with [Serverless framework](https://serverless.com/).

What this repo does for you:  
1- IAM role associated with lambda functions to allow cognito user pool modifications.  
2- Lambda functions to configure user pool client settings and user pool domain.  
3- Cognito user pool with configured client settings and domain.  
4- Identity providers configuration for cognito user pool.

Before you use this repo you need to ensure that you have [Node.js](https://nodejs.org) and [Serverless framework](https://serverless.com/) installed on your machine.  
To install serverless using npm run

```
npm install -g serverless
```

To use this repo, clone it to your local machine and run:

```
npm install
serverless deploy
```

To create your user pool domain, use the below cloudformation script and change the domain name

```
    AppUserPoolDomain:
      Type: 'Custom::${self:service}-${self:provider.stage}-CUPDomain'
      DependsOn:
        - CFNSendResponseLambdaFunction
        - CUPDomainLambdaFunction
      Properties:
        ServiceToken:
          Fn::GetAtt: [ CUPDomainLambdaFunction, Arn]
        UserPoolId:
          Ref: AppUserPool
        Domain: 'appuserpool01234'
```

To create a new identity provider for your user pool, for example Facebook

```
    FacebookIdp:
      Type: 'Custom::${self:service}-${self:provider.stage}-CUPIdentityProvider'
      DependsOn:
        - CFNSendResponseLambdaFunction
        - CUPIdentityProviderLambdaFunction
      Properties:
        ServiceToken:
          Fn::GetAtt: [CUPIdentityProviderLambdaFunction, Arn]
        UserPoolId:
          Ref: AppUserPool
        ProviderName: Facebook
        ProviderType: Facebook
        Client_id: 'YourFacebookAppID'
        Client_secret: 'YourFacebookAppSecert'
        Authorize_scopes: 'public_profile,email'
        AttributeMapping:
          email: "email"
```

After you create the identity provider, you need to enable it on the user pool client settings

```
    AppUserPoolClientSettings:
      Type: 'Custom::${self:service}-${self:provider.stage}-CUPClientSettings'
      DependsOn:
        - CFNSendResponseLambdaFunction
        - CUPClientSettingsLambdaFunction
        - FacebookIdp
      Properties:
        ServiceToken:
          Fn::GetAtt: [ CUPClientSettingsLambdaFunction, Arn]
        UserPoolId:
          Ref: AppUserPool
        UserPoolClientId:
          Ref: AppUserPoolClient
        SupportedIdentityProviders:
          - COGNITO
          - Facebook
        CallbackURL: 'https://www.yourdomain.com/callback' ##Replace this with your app callback url
        LogoutURL: 'https://www.yourdomain.com/logout' ##Replace this with your app logout url
        AllowedOAuthFlowsUserPoolClient: true
        AllowedOAuthFlows:
          - code
        AllowedOAuthScopes:
          - openid
```

Note that I am using [Serverless framework](https://serverless.com/) to build these custom resources, thats why I need to append 'LambdaFunction' to the end of my lambda functions naming while referencing on the resource section.
