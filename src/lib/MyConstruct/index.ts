import cdk = require('@aws-cdk/core');

export interface MyConstructProps {
  aCustomAttribute?: string;
}

export class MyConstruct extends cdk.Construct {
  /** @returns the ARN of the SQS queue */

  constructor(scope: cdk.Construct, id: string, props?: MyConstructProps) {
    super(scope, id);
    // Here insert your CDK code
    // please consider CDK guidelines stating that if ALL props elements are optionals, props should be declared optional
  }
}
