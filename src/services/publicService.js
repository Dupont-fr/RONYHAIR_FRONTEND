import axios from 'axios'
import { API } from './apiConfig'

export const getPublicCategories = async () => {
  const response = await axios.get(API.categories)
  return response.data
}

export const getCategoryBySlug = async (slug) => {
  const response = await axios.get(`${API.categories}/${slug}`)
  return response.data
}

export default { getPublicCategories, getCategoryBySlug }
