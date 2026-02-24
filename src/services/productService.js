import axios from 'axios'
import { getToken } from './authService'

// const API_URL = '/api/admin/products'

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://rony-hair-237.onrender.com/api/admin/products'
    : '/api/admin/products'

// const publicApiUrl = '/api/products'

const publicApiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://rony-hair-237.onrender.com/api/products'
    : '/api/products'

const getAuthHeaders = () => {
  const token = getToken()
  if (!token) return { 'Content-Type': 'application/json' }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

// Configuration pour inclure le token dans les requêtes
const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
})

// ============================================
// ROUTES ADMIN (Protégées)
// ============================================

// Créer un nouveau produit
export const createProduct = async (newProduct) => {
  if (!newProduct.id) {
    newProduct.id = Math.random().toString(36).substring(2, 9)
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(newProduct),
  })

  if (!response.ok) throw new Error('Erreur lors de la création du produit')
  return await response.json()
}

// Récupérer tous les produits (Admin)
export const getAllProducts = async () => {
  const res = await fetch(API_URL, { headers: getAuthHeaders() })
  if (!res.ok) throw new Error('Erreur de chargement des produits')
  return await res.json()
}

// Récupérer un produit par ID
export const getProductById = async (productId) => {
  const response = await fetch(`${API_URL}/${productId}`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Produit introuvable')
  return await response.json()
}

// Mettre à jour un produit
export const updateProduct = async (id, updatedProduct) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedProduct),
  })
  if (!response.ok) throw new Error('Erreur mise à jour du produit')
  return await response.json()
}

// Supprimer un produit
export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error('Erreur suppression du produit')
  return true
}

// Récupérer les produits d'une catégorie (Admin)
export const getProductsByCategory = async (categoryId) => {
  const response = await axios.get(
    `${API_URL}?category=${categoryId}`,
    getConfig(),
  )
  return response.data
}

// ============================================
// GESTION DES IMAGES
// ============================================

// Uploader une image produit
export const uploadProductImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await axios.post('/api/upload/product', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${getToken()}`,
    },
  })

  return response.data
}

// Supprimer une image produit
export const deleteProductImage = async (imageUrl) => {
  const response = await axios.delete('/api/upload/product', {
    data: { imageUrl },
    ...getConfig(),
  })

  return response.data
}

// Uploader plusieurs images
export const uploadMultipleImages = async (files) => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('images', file)
  })

  const response = await axios.post('/api/upload/products/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${getToken()}`,
    },
  })

  return response.data
}

// ============================================
// ROUTES PUBLIQUES
// ============================================

// Récupérer tous les produits publics
export const getPublicProducts = async () => {
  const res = await fetch(publicApiUrl)
  if (!res.ok) throw new Error('Erreur de chargement des produits')
  return await res.json()
}

// Récupérer un produit public par ID
export const getPublicProductById = async (id) => {
  const response = await fetch(`${publicApiUrl}/${id}`)
  if (!response.ok) throw new Error('Produit introuvable')
  return await response.json()
}

// Récupérer les produits d'une catégorie (Public)
export const getPublicProductsByCategory = async (categoryId) => {
  const response = await axios.get(`${publicApiUrl}?category=${categoryId}`)
  return response.data
}

// Filtrer les produits disponibles
export const getAvailableProducts = async () => {
  try {
    const response = await axios.get(`${publicApiUrl}?stock=disponible`)
    return response.data
  } catch (error) {
    throw new Error(
      'Erreur lors de la récupération des produits disponibles',
      error,
    )
  }
}

// ============================================
// LIKES / INTERACTIONS
// ============================================

// Liker / déliker un produit
export const updateProductLikes = async (productId, likesArray) => {
  const response = await axios.patch(
    `${publicApiUrl}/${productId}`,
    { likes: likesArray },
    { headers: getAuthHeaders() },
  )
  return response.data
}

// Incrémenter les vues d'un produit
export const incrementProductViews = async (productId) => {
  const response = await axios.post(`${publicApiUrl}/${productId}/view`)
  return response.data
}

// ============================================
// STATISTIQUES
// ============================================

// Récupérer les statistiques d'un produit
export const getProductStats = async (productId) => {
  const response = await axios.get(`${API_URL}/${productId}/stats`, getConfig())
  return response.data
}

// Récupérer les produits les plus vus
export const getMostViewedProducts = async (limit = 10) => {
  const response = await axios.get(`${publicApiUrl}/top-viewed?limit=${limit}`)
  return response.data
}

// Récupérer les produits les plus likés
export const getMostLikedProducts = async (limit = 10) => {
  const response = await axios.get(`${publicApiUrl}/top-liked?limit=${limit}`)
  return response.data
}

// ============================================
// RECHERCHE
// ============================================

// Rechercher des produits
export const searchProducts = async (query) => {
  const response = await axios.get(
    `${publicApiUrl}/search?q=${encodeURIComponent(query)}`,
  )
  return response.data
}

// ============================================
// EXPORT PAR DÉFAUT
// ============================================

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  uploadProductImage,
  deleteProductImage,
  uploadMultipleImages,
  getPublicProducts,
  getPublicProductById,
  getPublicProductsByCategory,
  getAvailableProducts,
  updateProductLikes,
  incrementProductViews,
  getProductStats,
  getMostViewedProducts,
  getMostLikedProducts,
  searchProducts,
}
