import useSWR, { SWRConfiguration } from 'swr';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { notification } from 'antd';
import { signOut } from 'next-auth/react'; // Import signOut from next-auth

interface UseSWRFetcherProps {
  key: string | [string, AxiosRequestConfig?] | AxiosRequestConfig | undefined;
  session?: { data?: { accessToken?: string } };
  swrOptions?: SWRConfiguration;
  axiosOptions?: AxiosRequestConfig;
  allRes?: boolean;
}

export function useSWRFetcher<T>({
  key,
  session,
  swrOptions,
  axiosOptions,
  allRes = false,
}: UseSWRFetcherProps) {
  return useSWR<T>(
    key,
    async (key) => {
      const url = Array.isArray(key) ? key[0] : key;
      const axiosConfig: AxiosRequestConfig = {
        url,
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        // headers: { Authorization: `Bearer ${session?.data?.accessToken}` }, // Uncomment to include the access token
        ...((typeof key === 'object' && !Array.isArray(key) && key !== null) && key),
        ...axiosOptions,
      };
      const response: AxiosResponse = await axios(axiosConfig);
      return allRes ? response : response.data;
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError: (err) => {
        if (err?.response?.status === 401) {
          // Trigger sign-out when a 401 status is detected
          signOut({ callbackUrl: '/auth' }); // Redirect to the login page after sign-out
        } else {
          notification['error']({
            message: err?.response?.data?.error ?? 'Error!',
            description: err?.response?.data?.message ?? err?.message,
          });
        }
      },
      ...swrOptions,
    }
  );
}
