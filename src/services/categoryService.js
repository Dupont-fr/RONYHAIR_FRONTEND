import axios from 'axios'
import { API, getAuthHeaders } from './apiConfig'

export const getAllCategories = async () => {
  const response = await axios.get(API.adminCategories, { headers: getAuthHeaders() })
  return response.data
}

export const getCategoryById = async (id) => {
  const response = await axios.get(`${API.adminCategories}/${id}`, { headers: getAuthHeaders() })
  return response.data
}

export const createCategory = async (categoryData) => {
  const response = await axios.post(API.adminCategories, categoryData, { headers: getAuthHeaders() })
  return response.data
}

export const updateCategory = async (id, categoryData) => {
  const response = await axios.put(`${API.adminCategories}/${id}`, categoryData, { headers: getAuthHeaders() })
  return response.data
}

export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API.adminCategories}/${id}`, { headers: getAuthHeaders() })
  return response.data
}

export const getPublicCategories = async () => {
  const response = await axios.get(API.categories)
  return response.data
}

export const getCategoryBySlug = async (slug) => {
  const response = await axios.get(`${API.categories}/${slug}`)
  return response.data
}

export const getCategoryProducts = async (categoryId) => {
  const response = await axios.get(`${API.categories}/${categoryId}/products`)
  return response.data
}

export const checkCategoryExists = async (nom) => {
  try {
    const data = await getAllCategories()
    const categories = data.categories || []
    return categories.some((cat) => cat.nom.toLowerCase() === nom.toLowerCase())
  } catch { return false }
}

export const getCategoryProductCount = async (categoryId) => {
  try {
    const response = await getCategoryById(categoryId)
    return response.category?.nombreProduits || 0
  } catch { return 0 }
}

export default {
  getAllCategories, getCategoryById, createCategory,
  updateCategory, deleteCategory,
  getPublicCategories, getCategoryBySlug, getCategoryProducts,
  checkCategoryExists, getCategoryProductCount,
}
