import * as iam from 'aws-cdk-lib/aws-iam';

import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Stack, StackProps } from 'aws-cdk-lib';
import { dirname, join } from 'path';

import { Bucket } from 'aws-cdk-lib/aws-s3';
import { CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

const __dirname = dirname(__filename);

export class AwsCdkProj1Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const usersTable = new Table(this, 'UsersTable', {
      tableName: 'Users',
      partitionKey: {
        name: 'userId',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST, // no capacity planning needed
    });

    const filesBucket = new Bucket(this, 'FilesBucket', {
      bucketName: 'my-cdk-proj1-files-bucket-v1', // must be globally unique for production code
    });

    const handler = new Function(this, 'MyLambdaFunction', {
      // runtime: Runtime.NODEJS_20_X,
      runtime: Runtime.PYTHON_3_10,
      memorySize: 128,
      handler: 'listBuckets.main',
      code: Code.fromAsset(join(__dirname, '../lambdas')),
      environment: {
        NAME: 'Julia',
        AGE: '30',
        USERS_TABLE_NAME: usersTable.tableName,
        FILES_BUCKET_NAME: filesBucket.bucketName,
      },
    });

    // grant the Lambda function R/W permissions to the table
    usersTable.grantReadWriteData(handler);
    filesBucket.grantReadWrite(handler);
    const listBucketsPolicy = iam.PolicyStatement.fromJson({
      Effect: 'Allow',
      Action: ['s3:ListAllMyBuckets'],
      Resource: ['*'],
    });
    handler.role?.attachInlinePolicy(
      new iam.Policy(this, 'list-resources-policy', {
        statements: [listBucketsPolicy],
      }),
    );

    new CfnOutput(this, 'LambdaFunctionName', {
      value: handler.functionArn,
    });
  }
}