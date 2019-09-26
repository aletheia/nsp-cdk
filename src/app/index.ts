import cdk = require('@aws-cdk/core');
import { MyConstruct } from '../lib/MyConstruct';

const myExampleApp = new cdk.App();
/* tslint:disable:no-unused-expression */
new MyConstruct(myExampleApp, 'MyExampleApp');
