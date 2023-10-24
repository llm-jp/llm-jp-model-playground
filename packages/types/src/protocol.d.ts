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
  max_new_tokens?: number;
  temperature?: number;
  repetition_penalty?: number;
  top_k?: number;
  top_p?: number;
  typical_p?: number;
};

export type PredictRequest = {
  messages: UnrecordedMessage[];
  params?: PredictParams;
};

export type PredictResponse = string;

export type PredictTitleRequest = {
  chat: Chat;
  messages: UnrecordedMessage[];
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
