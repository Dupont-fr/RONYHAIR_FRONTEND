import { API, getAuthHeaders } from './apiConfig'

export const createReview = async (reviewData) => {
  const response = await fetch(API.reviews, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erreur lors de la création de l'avis")
  }
  return await response.json()
}

export const getPublicReviews = async (page = 1, limit = 10) => {
  const res = await fetch(`${API.reviews}?page=${page}&limit=${limit}`)
  if (!res.ok) throw new Error('Erreur de chargement des avis')
  return await res.json()
}

export const updateReview = async (reviewId, visitorId, data) => {
  const response = await fetch(`${API.reviews}/${reviewId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId, ...data }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erreur lors de la modification de l'avis")
  }
  return await response.json()
}

export const deleteReview = async (reviewId, visitorId) => {
  const response = await fetch(`${API.reviews}/${reviewId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erreur lors de la suppression de l'avis")
  }
  return await response.json()
}

export const toggleLikeReview = async (reviewId, visitorId) => {
  const response = await fetch(`${API.reviews}/${reviewId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors du like')
  }
  return await response.json()
}

// ============================================
// ADMIN
// ============================================

export const getAdminReviews = async ({ status, page = 1, limit = 20 } = {}) => {
  const params = new URLSearchParams({ page, limit })
  if (status) params.set('status', status)
  const res = await fetch(`${API.reviews}/admin/all?${params}`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Erreur de chargement des avis')
  return await res.json()
}

export const moderateReview = async (reviewId, status) => {
  const response = await fetch(`${API.reviews}/admin/${reviewId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    credentials: 'include',
    body: JSON.stringify({ status }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erreur lors de la modération de l'avis")
  }
  return await response.json()
}

export const adminDeleteReview = async (reviewId) => {
  const response = await fetch(`${API.reviews}/admin/${reviewId}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erreur lors de la suppression de l'avis")
  }
  return await response.json()
}

export const getAdminPendingCount = async () => {
  const res = await fetch(`${API.reviews}/admin/all?status=pending&limit=1`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error('Erreur chargement')
  const data = await res.json()
  return data.total || 0
}

export default {
  createReview, getPublicReviews, updateReview, deleteReview, toggleLikeReview,
  getAdminReviews, moderateReview, adminDeleteReview, getAdminPendingCount,
}
