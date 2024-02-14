#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { GenerativeAiUseCasesStack } from '../lib/generative-ai-use-cases-stack';

const app = new cdk.App();

const stage = app.node.tryGetContext('stage') || '';

new GenerativeAiUseCasesStack(app, `${stage}GenerativeAiUseCasesStack`);
