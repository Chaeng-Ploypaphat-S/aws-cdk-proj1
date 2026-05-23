import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Stack, StackProps } from 'aws-cdk-lib';
import { dirname, join } from 'path';

import { Construct } from 'constructs';

const __dirname = dirname(__filename);

export class AwsCdkProj1Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const handler = new Function(this, 'MyLambdaFunction', {
      runtime: Runtime.NODEJS_20_X,
      memorySize: 512,
      handler: 'app.handler',
      code: Code.fromAsset(join(__dirname, '../lambdas')),
    });
  }
}