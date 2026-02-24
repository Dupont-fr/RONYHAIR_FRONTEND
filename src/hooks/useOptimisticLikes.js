import { useState, useEffect } from 'react'

const PENDING_LIKES_KEY = 'pending_likes'

// Hook pour gérer les likes de manière optimiste
export const useOptimisticLikes = (visitorId) => {
  const [pendingLikes, setPendingLikes] = useState({})

  // Charger les likes en attente depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem(PENDING_LIKES_KEY)
    if (saved) {
      try {
        setPendingLikes(JSON.parse(saved))
      } catch (e) {
        console.error('Erreur chargement likes:', e)
      }
    }
  }, [])

  // Sauvegarder les likes en attente dans localStorage
  const savePendingLikes = (likes) => {
    localStorage.setItem(PENDING_LIKES_KEY, JSON.stringify(likes))
    setPendingLikes(likes)
  }

  // Ajouter un like en attente
  const addPendingLike = (reviewId, action) => {
    const updated = {
      ...pendingLikes,
      [reviewId]: {
        action, // 'like' ou 'unlike'
        timestamp: Date.now(),
        visitorId,
      },
    }
    savePendingLikes(updated)
  }

  // Supprimer un like en attente après succès
  const removePendingLike = (reviewId) => {
    const updated = { ...pendingLikes }
    delete updated[reviewId]
    savePendingLikes(updated)
  }

  // Obtenir l'état d'un like (en tenant compte des likes en attente)
  const getLikeState = (review) => {
    const pending = pendingLikes[review._id]

    if (pending) {
      // Il y a un like en attente
      return pending.action === 'like'
    }

    // Sinon, on utilise l'état du serveur
    return review.likedBy?.includes(visitorId) || false
  }

  // Obtenir le nombre de likes (en tenant compte des likes en attente)
  const getLikeCount = (review) => {
    const pending = pendingLikes[review._id]
    const serverHasLike = review.likedBy?.includes(visitorId) || false
    const currentCount = review.likes || 0

    if (pending) {
      if (pending.action === 'like' && !serverHasLike) {
        return currentCount + 1
      } else if (pending.action === 'unlike' && serverHasLike) {
        return Math.max(0, currentCount - 1)
      }
    }

    return currentCount
  }

  return {
    pendingLikes,
    addPendingLike,
    removePendingLike,
    getLikeState,
    getLikeCount,
  }
}

// Service pour synchroniser les likes en attente
export const syncPendingLikes = async (pendingLikes, toggleLikeFn) => {
  const results = []

  for (const [reviewId, data] of Object.entries(pendingLikes)) {
    try {
      await toggleLikeFn(reviewId, data.visitorId)
      results.push({ reviewId, success: true })
    } catch (error) {
      console.error(`Erreur sync like ${reviewId}:`, error)
      results.push({ reviewId, success: false, error })
    }
  }

  return results
}
