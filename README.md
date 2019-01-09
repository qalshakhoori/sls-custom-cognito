## Cusom Cognito CloudFormation resources using serverless framework

At first I would like to thank Rosberg Linhares for his great work at [this repo](https://github.com/rosberglinhares/CloudFormationCognitoCustomResources).  
I used his work to make custom cognito resources with [Serverless framework](https://serverless.com/).  
  
  
What this repo does for you:  
1- IAM role associated with lambda functions to allow cognito user pool modifications.  
2- Lambda functions to configure user pool client settings and user pool domain.
3- Cognito user pool with configured client settings and domain.  
  
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