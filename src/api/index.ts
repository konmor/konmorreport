import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 5000,
})

// 请求拦截器
service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        /*const token = localStorage.getItem('token')
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`
        }*/
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        const res = response.data
        if (res.code !== 0) {
            console.error('API Error:', res.message)
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },
    (error) => {
        console.error('Request Error:', error)
        return Promise.reject(error)
    }
)

export default service