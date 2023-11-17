import { Stack, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CloudFrontToS3 } from '@aws-solutions-constructs/aws-cloudfront-s3';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { NodejsBuild } from 'deploy-time-build';
import * as s3 from 'aws-cdk-lib/aws-s3';

export interface WebProps {
  apiEndpointUrl: string;
  userPoolId: string;
  userPoolClientId: string;
  idPoolId: string;
  predictStreamFunctionArn: string;
  ragEnabled: boolean;
  selfSignUpEnabled: boolean;
  endpointName: string;
  endpointConfigName: string;
  models: string;
}

export class Web extends Construct {
  public readonly distribution: Distribution;

  constructor(scope: Construct, id: string, props: WebProps) {
    super(scope, id);

    const { cloudFrontWebDistribution, s3BucketInterface } = new CloudFrontToS3(
      this,
      'Web',
      {
        insertHttpSecurityHeaders: false,
        bucketProps: {
          blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
          encryption: s3.BucketEncryption.S3_MANAGED,
          autoDeleteObjects: true,
          removalPolicy: RemovalPolicy.DESTROY,
          objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
          enforceSSL: true,
        },
        cloudFrontDistributionProps: {
          errorResponses: [
            {
              httpStatus: 403,
              responseHttpStatus: 200,
              responsePagePath: '/index.html',
            },
            {
              httpStatus: 404,
              responseHttpStatus: 200,
              responsePagePath: '/index.html',
            },
          ],
        },
      }
    );

    new NodejsBuild(this, 'BuildWeb', {
      assets: [
        {
          path: '../../',
          exclude: [
            '.git',
            'node_modules',
            'packages/cdk/cdk.out',
            'packages/cdk/node_modules',
            'packages/web/dist',
            'packages/web/node_modules',
          ],
        },
      ],
      destinationBucket: s3BucketInterface,
      distribution: cloudFrontWebDistribution,
      outputSourceDirectory: './packages/web/dist',
      buildCommands: ['npm ci', 'npm run web:build'],
      buildEnvironment: {
        VITE_APP_API_ENDPOINT: props.apiEndpointUrl,
        VITE_APP_REGION: Stack.of(this).region,
        VITE_APP_USER_POOL_ID: props.userPoolId,
        VITE_APP_USER_POOL_CLIENT_ID: props.userPoolClientId,
        VITE_APP_IDENTITY_POOL_ID: props.idPoolId,
        VITE_APP_PREDICT_STREAM_FUNCTION_ARN: props.predictStreamFunctionArn,
        VITE_APP_RAG_ENABLED: props.ragEnabled.toString(),
        VITE_APP_SAGEMAKER_ENDPOINT_NAME: props.endpointName,
        VITE_APP_SAGEMAKER_ENDPOINT_CONFIG_NAME: props.endpointConfigName,
        VITE_APP_SAGEMAKER_MODELS: props.models,
        VITE_APP_SELF_SIGN_UP_ENABLED: props.selfSignUpEnabled.toString(),
      },
    });

    this.distribution = cloudFrontWebDistribution;
  }
}
