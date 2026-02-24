import axios from 'axios'

// const publicBaseUrl = '/api/categories'

const publicBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://rony-hair-237.onrender.com/api/categories'
    : '/api/categories'

// ============================================
// ROUTES PUBLIQUES (Sans authentification)
// ============================================

// Récupérer toutes les catégories actives avec leurs images
export const getPublicCategories = async () => {
  const response = await axios.get(publicBaseUrl)
  return response.data
}

// Récupérer une catégorie par slug avec ses images
export const getCategoryBySlug = async (slug) => {
  const response = await axios.get(`${publicBaseUrl}/${slug}`)
  return response.data
}

// ============================================
// EXPORT PAR DÉFAUT
// ============================================

export default {
  getPublicCategories,
  getCategoryBySlug,
}
