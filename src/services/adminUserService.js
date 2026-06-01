import axios from 'axios'
import { API, getAuthHeaders } from './apiConfig'

const apiClient = axios.create({
  baseURL: API.admin,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export const createAdmin = async (adminData) => {
  try {
    const response = await apiClient.post('/create', adminData, { headers: getAuthHeaders() })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la création')
  }
}

export const getAdmins = async () => {
  try {
    const response = await apiClient.get('/list', { headers: getAuthHeaders() })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors du chargement')
  }
}

export const toggleAdminStatus = async (adminId) => {
  try {
    const response = await apiClient.put(`/${adminId}/toggle-status`, {}, { headers: getAuthHeaders() })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la modification')
  }
}

export const deleteAdmin = async (adminId) => {
  try {
    const response = await apiClient.delete(`/${adminId}`, { headers: getAuthHeaders() })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression')
  }
}

export default { createAdmin, getAdmins, toggleAdminStatus, deleteAdmin }
