import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PredictRequest } from 'generative-ai-use-cases-jp';
import sagemakerApi from './utils/sagemakerApi';
import bedrockApi from './utils/bedrockApi';
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger();

const modelType = process.env.MODEL_TYPE || 'bedrock';
const api =
  {
    bedrock: bedrockApi,
    sagemaker: sagemakerApi,
  }[modelType] || bedrockApi;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const req: PredictRequest = JSON.parse(event.body!);
    const response = await api.invoke(req.inputs);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(response),
    };
  } catch (error: any) {
    logger.error(error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
