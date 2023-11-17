import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UpdateFeedbackRequest } from 'generative-ai-use-cases-jp';
import { updateFeedback } from './repository';
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const chatId = event.pathParameters!.chatId!;
    const req: UpdateFeedbackRequest = JSON.parse(event.body!);

    const message = await updateFeedback(chatId, req.createdDate, req.feedback);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message }),
    };
  } catch (error: unknown) {
    if (error instanceof Error) logger.error(error.message);
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
