import { create } from 'zustand';
import useHttp from './useHttp';
import {
  CreateEndpointResponse,
  EndpointStatusResponse,
} from 'generative-ai-use-cases-jp';
import { SWRResponse } from 'swr';
import useChatApi from './useChatApi';

const useEndpoint = create<{
  status: string;
  createEndpoint: () => void;
  deleteEndpoint: () => void;
  fetchEndpoint: () => SWRResponse;
}>((set) => {
  const http = useHttp();
  const { predictStream } = useChatApi();

  const INIT_STATE = {
    status: '',
  };

  const fetchEndpoint = () => {
    return http.get<EndpointStatusResponse>(`endpoint`, {
      refreshInterval: 30000,
      onSuccess: (data: EndpointStatusResponse) => {
        console.log(data.EndpointStatus);
        set({ status: data.EndpointStatus || 'OutOfService' });
      },
    });
  };

  const createEndpoint = () => {
    http
      .post<CreateEndpointResponse>(`endpoint`, {})
      .then(() => set({ status: 'Processing' }));
    // Endpoint 消すためのアラートが起動している状態で
    // Endpoint 立て直しただけでリクエストがない状態だと再トリガーされないため一度空リクエストを送る
    predictStream({ inputs: '' });
  };

  const deleteEndpoint = () => {
    http
      .delete<CreateEndpointResponse>(`endpoint`)
      .then(() => set({ status: 'Processing' }));
  };

  return {
    ...INIT_STATE,
    createEndpoint,
    deleteEndpoint,
    fetchEndpoint,
  };
});

export default useEndpoint;
