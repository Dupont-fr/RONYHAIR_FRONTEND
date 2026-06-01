import axios from 'axios'
import { API, getAuthHeaders } from './apiConfig'

export const getCategoryImages = async (categoryId) => {
  const response = await axios.get(`${API.adminCategories}/${categoryId}/images`, { headers: getAuthHeaders() })
  return response.data
}

export const addImageToCategory = async (categoryId, imageData) => {
  const response = await axios.post(`${API.adminCategories}/${categoryId}/images`, imageData, { headers: getAuthHeaders() })
  return response.data
}

export const updateImage = async (imageId, imageData) => {
  const response = await axios.put(`${API.adminCategories}/images/${imageId}`, imageData, { headers: getAuthHeaders() })
  return response.data
}

export const deleteImage = async (imageId) => {
  const response = await axios.delete(`${API.adminCategories}/images/${imageId}`, { headers: getAuthHeaders() })
  return response.data
}

export const reorderImages = async (categoryId, imageIds) => {
  const response = await axios.put(`${API.adminCategories}/${categoryId}/images/reorder`, { imageIds }, { headers: getAuthHeaders() })
  return response.data
}

const CLOUDINARY_CLOUD_NAME = 'ddnolovmg'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`
const CLOUDINARY_UPLOAD_PRESET = 'rony_hair_uploads'

export const uploadImageToCloudinary = async (file, onProgress = null, folder = 'menuiserie/products') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', 'menuiserie/products')

  try {
    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      withCredentials: false,
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentCompleted)
        }
      },
    })
    return { url: response.data.secure_url, publicId: response.data.public_id }
  } catch (error) {
    throw new Error("Erreur lors de l'upload de l'image")
  }
}

export const deleteImageFromCloudinary = async (publicId) => {
  try {
    await axios.post(`${API.admin}/delete-cloudinary-image`, { publicId }, { headers: getAuthHeaders() })
  } catch (error) {
    console.error('Erreur suppression Cloudinary:', error)
  }
}

export default {
  getCategoryImages, addImageToCategory, updateImage, deleteImage, reorderImages,
  uploadImageToCloudinary, deleteImageFromCloudinary,
}
