import axios from 'axios'

// Base Axios instance — all assistant services import from here
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

// Automatically attach JWT token from localStorage to all assistant requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('bgr_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
