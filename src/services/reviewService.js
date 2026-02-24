// const API_URL = '/api/reviews'

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://rony-hair-237.onrender.com/api/reviews'
    : '/api/reviews'

// ============================================
// ROUTES PUBLIQUES (Visiteurs)
// ============================================

// Créer un avis (visiteur)
export const createReview = async (reviewData) => {
  const response = await fetch(API_URL, {
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

// Récupérer tous les avis publiés
export const getPublicReviews = async () => {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error('Erreur de chargement des avis')
  return await res.json()
}

// Modifier un avis
export const updateReview = async (reviewId, visitorId, data) => {
  const response = await fetch(`${API_URL}/${reviewId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitorId,
      ...data,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erreur lors de la modification de l'avis")
  }
  return await response.json()
}

// Supprimer un avis
export const deleteReview = async (reviewId, visitorId) => {
  const response = await fetch(`${API_URL}/${reviewId}`, {
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

// Liker/Déliker un avis
export const toggleLikeReview = async (reviewId, visitorId) => {
  const response = await fetch(`${API_URL}/${reviewId}/like`, {
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
// EXPORT PAR DÉFAUT
// ============================================

export default {
  createReview,
  getPublicReviews,
  updateReview,
  deleteReview,
  toggleLikeReview,
}
