import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout: 5000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    /*const token = localStorage.getItem('token')
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`
    }*/
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const res = response.data
      // || res == undefined || res.code != 0
    if (response.status != 200 ) {
      window.alert('处理失败')
      return Promise.reject(new Error('Error'))
    } else {
      return res
    }
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  },
)

export default instance
