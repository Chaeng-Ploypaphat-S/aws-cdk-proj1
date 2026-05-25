#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib/core';

import { AwsCdkProj1Stack } from '../lib/aws-cdk-proj1-stack';

const app = new cdk.App();
new AwsCdkProj1Stack(app, 'AwsCdkProj1Stack', {
});
