import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PredictTitleRequest } from 'generative-ai-use-cases-jp';
import { setChatTitle } from './repository';
import sagemakerApi from './utils/sagemakerApi';
import bedrockApi from './utils/bedrockApi';

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
    const req: PredictTitleRequest = JSON.parse(event.body!);

    let title = '';
    for await (const token of api.invokeStream(req.inputs)) {
      title += token.replace('<pad|LLM-jp>', '').trim();
    }

    await setChatTitle(req.chat.id, req.chat.createdDate, title);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: title,
    };
  } catch (error) {
    console.log(error);
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
