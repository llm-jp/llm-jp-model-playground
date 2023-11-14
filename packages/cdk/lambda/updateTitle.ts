import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UpdateTitleRequest } from 'generative-ai-use-cases-jp';
import { findChatById, setChatTitle } from './repository';
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId: string =
      event.requestContext.authorizer!.claims['cognito:username'];
    const chatId = event.pathParameters!.chatId!;
    const req: UpdateTitleRequest = JSON.parse(event.body!);

    const chatItem = await findChatById(userId, chatId);

    if (!chatItem) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: '',
      };
    }

    const updatedChat = await setChatTitle(
      chatItem?.id,
      chatItem?.createdDate,
      req.title
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ chat: updatedChat }),
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
