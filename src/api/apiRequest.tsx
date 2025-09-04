import axios, { AxiosRequestConfig, Method } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest<T = any>(
  method: Method,
  endpoint: string,
  data?: any,
  customHeaders?: Record<string, string>
): Promise<{
  data: T | null;
  status: number;
  message: string;
  error: any;
}> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const config: AxiosRequestConfig = {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...customHeaders,
        },
        ...(data && { data }),
    };

    try {
        const response = await axios(config);
        const { status, data } = response;

        return {
            data: data ?? data,
            status,
            message: data.message ?? 'Success',
            error: null,
        };
    } catch (err: any) {
        const status = err.response?.status || 500;
        const payload = err.response?.data;
        
        return {
            data: null,
            status,
            message: payload?.message || 'Something went wrong',
            error: payload?.error || err.message,
        };
    }
}
