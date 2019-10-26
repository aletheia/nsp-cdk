# NSP-CDK: Neosperience AWS CDK Construct Library

![David](https://img.shields.io/david/dev/aletheia/nsp-cdk)
![GitHub](https://img.shields.io/github/license/aletheia/nsp-cdk)
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/aletheia/nsp-cdk/master)
[![Build Status](https://travis-ci.org/aletheia/nsp-cdk.svg?branch=master)](https://travis-ci.org/aletheia/nsp-cdk)
[![Codeship Status for aletheia/nsp-cdk](https://app.codeship.com/projects/91fb3c00-c348-0137-e2d8-46b8881cf0ad/status?branch=master)](https://app.codeship.com/projects/366545)
[![Maintainability](https://api.codeclimate.com/v1/badges/7e20d9a28607778d6738/maintainability)](https://codeclimate.com/github/aletheia/nsp-cdk/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/7e20d9a28607778d6738/test_coverage)](https://codeclimate.com/github/aletheia/nsp-cdk/test_coverage)

## Reason for this project
AWS Cloud Development Kit is definitely a game changer because makes easy programming cloud infrastructure in your preferred language.
Nonetheless, this framework is a starting point for complex constructs that can encapsulate deeper logic, providing developers with libraries to use in their projects.

This project aims building a set of high order constructs that can ease building application services, using serverless technologies.



## Getting Started

To get started with this library, first import NPM package

```bash
yarn add nsp-cdk
```

then in your stack import the desired construct and it as a standard L2 construct

```javascript
import { ApplicationEndpoint } from "lib/fargate-web-service";

const app = new cdk.App();
const stack = new cdk.Stack(app, "FargateWebServiceStack");
const endpoint = new ApplicationEndpoint(stack, "Fargate", {
  dockerImage: "registry.hub.docker.com/library:latesr"
});
```
