import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export const apiClient: AxiosInstance = axios.create({
  timeout: 15000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

export async function fetchJson<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

export async function fetchBlob(
  url: string,
  config?: AxiosRequestConfig
): Promise<Blob> {
  const response = await apiClient.get<Blob>(url, {
    ...config,
    responseType: "blob",
  });
  return response.data;
}

export async function fetchArrayBuffer(
  url: string,
  config?: AxiosRequestConfig
): Promise<ArrayBuffer> {
  const response = await apiClient.get<ArrayBuffer>(url, {
    ...config,
    responseType: "arraybuffer",
  });
  return response.data;
}
