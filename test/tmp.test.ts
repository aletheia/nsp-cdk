//import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import MyConstruct = require('../src/lib/MyConstruct/index');

test('MyConstruct Test example', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'MyTestStack');
  // WHEN
  // insert creation code here
  // THEN
  // test with AWS CDK Assert library. before uncomment above
  //expectCDK(stack).to(haveResource("AWS::SQS::Queue"));
});
