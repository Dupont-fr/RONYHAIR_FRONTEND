import axios from 'axios'
import { getToken } from './authService'

// const baseUrl = '/api/admin/categories'
const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://gaetan-bois.onrender.com/api/admin/categories'
    : '/api/admin/categories'

// Configuration pour inclure le token
const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
})

// ============================================
// GESTION DES IMAGES
// ============================================

// Récupérer toutes les images d'une catégorie
export const getCategoryImages = async (categoryId) => {
  const response = await axios.get(
    `${baseUrl}/${categoryId}/images`,
    getConfig(),
  )
  return response.data
}

// Ajouter une image à une catégorie
export const addImageToCategory = async (categoryId, imageData) => {
  const response = await axios.post(
    `${baseUrl}/${categoryId}/images`,
    imageData,
    getConfig(),
  )
  return response.data
}

// Modifier une image
export const updateImage = async (imageId, imageData) => {
  const response = await axios.put(
    `/api/admin/categories/images/${imageId}`,
    imageData,
    getConfig(),
  )
  return response.data
}

// Supprimer une image
export const deleteImage = async (imageId) => {
  const response = await axios.delete(
    `/api/admin/categories/images/${imageId}`,
    getConfig(),
  )
  return response.data
}

// Réorganiser les images
export const reorderImages = async (categoryId, imageIds) => {
  const response = await axios.put(
    `${baseUrl}/${categoryId}/images/reorder`,
    { imageIds },
    getConfig(),
  )
  return response.data
}

// ============================================
// UPLOAD CLOUDINARY menuiserie_unsigned
// ============================================

const CLOUDINARY_CLOUD_NAME = 'ddnolovmg'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`
const CLOUDINARY_UPLOAD_PRESET = 'rony_hair_uploads' // À créer dans Cloudinary

/**
 * Upload une image sur Cloudinary
 * @param {File} file - Le fichier image à uploader
 * @param {Function} onProgress - Callback pour suivre la progression (0-100)
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImageToCloudinary = async (file, onProgress = null) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', 'menuiserie/products')

  try {
    // Créer une instance axios sans credentials pour Cloudinary
    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      withCredentials: false, // ⚠️ IMPORTANT : Désactiver pour Cloudinary
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          )
          onProgress(percentCompleted)
        }
      },
    })

    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,
    }
  } catch (error) {
    console.error('Erreur upload Cloudinary:', error)
    throw new Error("Erreur lors de l'upload de l'image")
  }
}

/**
 * Supprimer une image de Cloudinary (nécessite un backend endpoint)
 * Note: Cloudinary nécessite une signature pour la suppression
 * Il faut passer par le backend pour signer la requête
 */
export const deleteImageFromCloudinary = async (publicId) => {
  // TODO: Créer un endpoint backend pour supprimer de Cloudinary
  console.log('Suppression Cloudinary à implémenter:', publicId)
}

// ============================================
// EXPORT PAR DÉFAUT
// ============================================

export default {
  getCategoryImages,
  addImageToCategory,
  updateImage,
  deleteImage,
  reorderImages,
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
}
