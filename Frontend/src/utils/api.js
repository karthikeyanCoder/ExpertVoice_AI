import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const chatAPI = {
  /**
   * Send a chat message to the backend
   * @param {Array} messages - Array of message objects with role and content
   * @returns {Promise} Response from the backend
   */
  sendMessage: async (messages) => {
    try {
      const response = await apiClient.post('/chat', {
        messages,
      })
      return response.data
    } catch (error) {
      console.error('Chat API error:', error)
      throw error
    }
  },

  /**
   * Check backend health status
   */
  checkHealth: async () => {
    try {
      const response = await apiClient.get('/health')
      return response.data
    } catch (error) {
      console.error('Health check error:', error)
      throw error
    }
  },
}

export default apiClient
