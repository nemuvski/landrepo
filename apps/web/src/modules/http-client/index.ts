import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const baseConfig: AxiosRequestConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
  responseEncoding: 'utf8',
  maxRedirects: 1,
  validateStatus: (status) => {
    return 200 <= status && status < 300
  },
}

/**
 * NextAppのAPI Routesへのアクセス専用のAxiosインスタンス
 */
export const axiosNextApiRoute = axios.create({
  ...baseConfig,
  baseURL: '/api',
  withCredentials: true,
})
