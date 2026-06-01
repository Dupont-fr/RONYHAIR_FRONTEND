import axios from 'axios'
import { API, getAuthHeaders } from './apiConfig'

export const getAllPromotions = async () => {
  const response = await axios.get(API.adminPromotions, { headers: getAuthHeaders() })
  return response.data
}

export const getPromotionById = async (id) => {
  const response = await axios.get(`${API.adminPromotions}/${id}`, { headers: getAuthHeaders() })
  return response.data
}

export const createPromotion = async (promotionData) => {
  const response = await axios.post(API.adminPromotions, promotionData, { headers: getAuthHeaders() })
  return response.data
}

export const updatePromotion = async (id, promotionData) => {
  const response = await axios.put(`${API.adminPromotions}/${id}`, promotionData, { headers: getAuthHeaders() })
  return response.data
}

export const deletePromotion = async (id) => {
  const response = await axios.delete(`${API.adminPromotions}/${id}`, { headers: getAuthHeaders() })
  return response.data
}

export const togglePromotion = async (id) => {
  const response = await axios.patch(`${API.adminPromotions}/${id}/toggle`, {}, { headers: getAuthHeaders() })
  return response.data
}

export const getActivePromotions = async () => {
  const response = await axios.get(`${API.promotions}/active`)
  return response.data
}

export const getPromotionByCategory = async (categoryId) => {
  const response = await axios.get(`${API.promotions}/category/${categoryId}`)
  return response.data
}

export const getTombolaPromotions = async () => {
  const response = await axios.get(`${API.promotions}/tombola`)
  return response.data
}

export default {
  getAllPromotions, getPromotionById, createPromotion,
  updatePromotion, deletePromotion, togglePromotion,
  getActivePromotions, getPromotionByCategory, getTombolaPromotions,
}
