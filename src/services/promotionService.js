import axios from 'axios'
import { getToken } from './authService'

// const adminBaseUrl = '/api/admin/promotions'

const adminBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://rony-hair-237.onrender.com/api/admin/promotions'
    : '/api/admin/promotions'

// const publicBaseUrl = '/api/promotions'

const publicBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://rony-hair-237.onrender.com/api/promotions'
    : '/api/promotions'

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
})

export const getAllPromotions = async () => {
  const response = await axios.get(adminBaseUrl, getConfig())
  return response.data
}

export const getPromotionById = async (id) => {
  const response = await axios.get(`${adminBaseUrl}/${id}`, getConfig())
  return response.data
}

export const createPromotion = async (promotionData) => {
  const response = await axios.post(adminBaseUrl, promotionData, getConfig())
  return response.data
}

export const updatePromotion = async (id, promotionData) => {
  const response = await axios.put(
    `${adminBaseUrl}/${id}`,
    promotionData,
    getConfig(),
  )
  return response.data
}

export const deletePromotion = async (id) => {
  const response = await axios.delete(`${adminBaseUrl}/${id}`, getConfig())
  return response.data
}

export const togglePromotion = async (id) => {
  const response = await axios.patch(
    `${adminBaseUrl}/${id}/toggle`,
    {},
    getConfig(),
  )
  return response.data
}

export const getActivePromotions = async () => {
  const response = await axios.get(`${publicBaseUrl}/active`)
  return response.data
}

export const getPromotionByCategory = async (categoryId) => {
  const response = await axios.get(`${publicBaseUrl}/category/${categoryId}`)
  return response.data
}

export const getTombolaPromotions = async () => {
  const response = await axios.get(`${publicBaseUrl}/tombola`)
  return response.data
}

export default {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotion,
  getActivePromotions,
  getPromotionByCategory,
  getTombolaPromotions,
}
