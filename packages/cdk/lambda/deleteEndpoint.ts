import { SageMaker } from '@aws-sdk/client-sagemaker';
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger();

const sagemaker = new SageMaker();
const endpointName = process.env.ENDPOINT_NAME;

exports.handler = async () => {
  try {
    // Delete the SageMaker endpoint
    await sagemaker.deleteEndpoint({ EndpointName: endpointName });
    logger.info(`SageMaker endpoint deleted: ${endpointName}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error(`Error: ${error}`);
    }
  }
};
