import { create } from 'zustand';
import useHttp from './useHttp';
import {
  CreateEndpointResponse,
  EndpointStatusResponse,
} from 'generative-ai-use-cases-jp';
import { SWRResponse } from 'swr';

const useEndpoint = create<{
  status: string;
  createEndpoint: () => void;
  deleteEndpoint: () => void;
  fetchEndpoint: () => SWRResponse;
}>((set) => {
  const http = useHttp();

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
