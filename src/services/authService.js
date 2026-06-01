import axios from 'axios'
import { API } from './apiConfig'

axios.defaults.withCredentials = true

const apiClient = axios.create({
  baseURL: API.admin,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export const getToken = () => localStorage.getItem('adminToken')
export const setToken = (token) => localStorage.setItem('adminToken', token)
export const removeToken = () => localStorage.removeItem('adminToken')

export const getAdminFromStorage = () => {
  try {
    const adminInfo = localStorage.getItem('adminInfo')
    return adminInfo ? JSON.parse(adminInfo) : null
  } catch { return null }
}

export const setAdminToStorage = (adminData) => {
  try { localStorage.setItem('adminInfo', JSON.stringify(adminData)) } catch {}
}

export const removeAdminFromStorage = () => {
  try { localStorage.removeItem('adminInfo') } catch {}
}

export const loginAdmin = async (credentials) => {
  try {
    const response = await apiClient.post('/login', credentials)
    if (response.data.success && response.data.admin) {
      setAdminToStorage(response.data.admin)
    }
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Identifiants incorrects')
  }
}

export const logoutAdmin = async () => {
  try {
    const response = await apiClient.post('/logout')
    removeToken()
    removeAdminFromStorage()
    return response.data
  } catch (error) {
    removeToken()
    removeAdminFromStorage()
    throw error
  }
}

export const checkAuthStatus = async () => {
  try {
    const response = await apiClient.get('/me')
    if (response.data.success && response.data.admin) {
      setAdminToStorage(response.data.admin)
    }
    return response.data
  } catch (error) {
    removeToken()
    removeAdminFromStorage()
    throw error
  }
}

export const createFirstAdmin = async (adminData) => {
  try {
    const response = await apiClient.post('/create-first', adminData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur création admin')
  }
}

export default {
  loginAdmin, logoutAdmin, checkAuthStatus, createFirstAdmin,
  getToken, setToken, removeToken,
  getAdminFromStorage, setAdminToStorage, removeAdminFromStorage,
}
