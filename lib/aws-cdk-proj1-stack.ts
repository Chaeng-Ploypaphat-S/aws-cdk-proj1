import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Stack, StackProps } from 'aws-cdk-lib';
import { dirname, join } from 'path';

import { CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

const __dirname = dirname(__filename);

export class AwsCdkProj1Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const handlerFun = new Function(this, 'MyLambdaFunction', {
      runtime: Runtime.NODEJS_20_X,
      memorySize: 128,
      handler: 'app.handler',
      code: Code.fromAsset(join(__dirname, '../lambdas')),
      environment: {
        NAME: 'Julia',
        AGE: '30',
      },
    });

    new CfnOutput(this, 'LambdaFunctionName', {
      value: handlerFun.functionArn,
    });
  }
}