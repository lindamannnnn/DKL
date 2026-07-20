import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4001'

const client = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：自动附加 token 和 tenantId
client.interceptors.request.use((config) => {
  // 兼容旧版 key
  const token = localStorage.getItem('token') || localStorage.getItem('dkl_token')
  const tenantId = localStorage.getItem('tenantId') || localStorage.getItem('dkl_tenantId')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (tenantId) {
    config.headers['X-Tenant-Id'] = tenantId
  }

  return config
})

// 响应拦截器：统一处理错误
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || '请求失败'
    console.error('API Error:', message)

    // 401 自动登出（生产环境）
    if (error.response?.status === 401 && import.meta.env.PROD) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    return Promise.reject(new Error(message))
  }
)

export default client
