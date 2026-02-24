import axios from 'axios'
import { getToken } from './authService'

// const baseUrl = '/api/admin/categories'
const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://gaetan-bois.onrender.com/api/admin/categories'
    : '/api/admin/categories'

// const publicBaseUrl = '/api/categories'
const publicBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://gaetan-bois.onrender.com/api/categories'
    : '/api/categories'

// Configuration pour inclure le token dans les requêtes
const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
})

// ============================================
// ROUTES ADMIN (Protégées)
// ============================================

// Récupérer toutes les catégories (Admin)
export const getAllCategories = async () => {
  const response = await axios.get(baseUrl, getConfig())
  return response.data
}

// Récupérer une catégorie par ID (Admin)
export const getCategoryById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, getConfig())
  return response.data
}

// Créer une nouvelle catégorie (Admin)
export const createCategory = async (categoryData) => {
  const response = await axios.post(baseUrl, categoryData, getConfig())
  return response.data
}

// Mettre à jour une catégorie (Admin)
export const updateCategory = async (id, categoryData) => {
  const response = await axios.put(
    `${baseUrl}/${id}`,
    categoryData,
    getConfig(),
  )
  return response.data
}

// Supprimer une catégorie (Admin)
export const deleteCategory = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
  return response.data
}

// ============================================
// ROUTES PUBLIQUES (Sans authentification)
// ============================================

// Récupérer toutes les catégories actives (Public)
export const getPublicCategories = async () => {
  const response = await axios.get(publicBaseUrl)
  return response.data
}

// Récupérer une catégorie par slug (Public)
export const getCategoryBySlug = async (slug) => {
  const response = await axios.get(`${publicBaseUrl}/${slug}`)
  return response.data
}

// Récupérer les produits d'une catégorie (Public)
export const getCategoryProducts = async (categoryId) => {
  const response = await axios.get(`${publicBaseUrl}/${categoryId}/products`)
  return response.data
}

// ============================================
// UTILITAIRES
// ============================================

// Vérifier si une catégorie existe par nom
export const checkCategoryExists = async (nom) => {
  try {
    const data = await getAllCategories()
    const categories = data.categories || []

    return categories.some((cat) => cat.nom.toLowerCase() === nom.toLowerCase())
  } catch (error) {
    console.error('Error checking category existence:', error)
    return false
  }
}

// Compter le nombre de produits dans une catégorie
export const getCategoryProductCount = async (categoryId) => {
  try {
    const response = await getCategoryById(categoryId)
    return response.category?.nombreProduits || 0
  } catch (error) {
    console.error('Erreur comptage produits:', error)
    return 0
  }
}

// ============================================
// EXPORT PAR DÉFAUT
// ============================================

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getPublicCategories,
  getCategoryBySlug,
  getCategoryProducts,
  checkCategoryExists,
  getCategoryProductCount,
}
