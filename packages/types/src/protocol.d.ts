import {
  RecordedMessage,
  ShownMessage,
  ToBeRecordedMessage,
  UnrecordedMessage,
} from './message';
import { Chat } from './chat';
import {
  QueryCommandOutput,
  RetrieveCommandOutput,
} from '@aws-sdk/client-kendra';

export type CreateChatResponse = {
  chat: Chat;
};

export type CreateMessagesRequest = {
  messages: ToBeRecordedMessage[];
};

export type CreateMessagesResponse = {
  messages: RecordedMessage[];
};

export type ListChatsResponse = {
  chats: Chat[];
};

export type FindChatByIdResponse = {
  chat: Chat;
};

export type ListMessagesResponse = {
  messages: RecordedMessage[];
};

export type UpdateFeedbackRequest = {
  createdDate: string;
  feedback: string;
};

export type UpdateFeedbackResponse = {
  message: RecordedMessage;
};

export type UpdateTitleRequest = {
  title: string;
};

export type UpdateTitleResponse = {
  chat: Chat;
};

export type PredictParams = {
  variant?: string;
  max_new_tokens?: number;
  temperature?: number;
  repetition_penalty?: number;
  top_p?: number;
  seed?: number;
};

export type PredictRequest = {
  inputs: string;
  params?: PredictParams;
};

export type PredictResponse = string;

export type PredictTitleRequest = {
  chat: Chat;
  inputs: string;
  eos_token: string;
};

export type PredictTitleResponse = string;

export type QueryKendraRequest = {
  query: string;
};

export type QueryKendraResponse = QueryCommandOutput;

export type RetrieveKendraRequest = {
  query: string;
};

export type RetrieveKendraResponse = RetrieveCommandOutput;

export type CreateEndpointResponse = {
  Message: string;
};

export type EndpointStatusResponse = {
  EndpointStatus:
    | 'OutOfService'
    | 'Creating'
    | 'Updating'
    | 'SystemUpdating'
    | 'RollingBack'
    | 'InService'
    | 'Deleting'
    | 'Failed'
    | 'UpdateRollbackFailed';
};
