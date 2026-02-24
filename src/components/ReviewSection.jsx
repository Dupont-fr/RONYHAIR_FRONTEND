import React, { useEffect, useState, useRef } from 'react'
import * as reviewService from '../services/reviewService'
import { getVisitorId } from '../services/analyticsService'
import {
  useOptimisticLikes,
  syncPendingLikes,
} from '../hooks/useOptimisticLikes'
import './styles/ReviewSection.css'

const ThumbIcon = ({ filled }) => (
  <svg
    className={`thumb-icon ${filled ? 'filled' : ''}`}
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z' />
  </svg>
)

const DotsMenuIcon = () => (
  <svg className='dots-icon' viewBox='0 0 24 24' fill='currentColor'>
    <circle cx='12' cy='5' r='2' />
    <circle cx='12' cy='12' r='2' />
    <circle cx='12' cy='19' r='2' />
  </svg>
)

const ReviewSection = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [expandedReviews, setExpandedReviews] = useState({})
  const menuRef = useRef(null)

  const visitorId = getVisitorId()
  const {
    pendingLikes,
    addPendingLike,
    removePendingLike,
    getLikeState,
    getLikeCount,
  } = useOptimisticLikes(visitorId)

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    message: '',
  })

  const [photoPreview, setPhotoPreview] = useState(null)

  // Charger les infos du localStorage
  useEffect(() => {
    const savedNom = localStorage.getItem('user_nom')
    const savedPrenom = localStorage.getItem('user_prenom')
    const savedPhoto = localStorage.getItem('user_photo')

    if (savedNom && savedPrenom) {
      setFormData((prev) => ({
        ...prev,
        nom: savedNom,
        prenom: savedPrenom,
      }))
      if (savedPhoto) {
        setPhotoPreview(savedPhoto)
      }
    }
  }, [])

  // Fermer le menu au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    loadReviews()
  }, [])

  // Synchroniser les likes en attente quand la connexion revient
  useEffect(() => {
    const syncLikes = async () => {
      if (Object.keys(pendingLikes).length > 0) {
        const results = await syncPendingLikes(
          pendingLikes,
          reviewService.toggleLikeReview,
        )

        // Supprimer les likes synchronisés avec succès
        results.forEach(({ reviewId, success }) => {
          if (success) {
            removePendingLike(reviewId)
          }
        })

        // Recharger les avis après la synchronisation
        if (results.some((r) => r.success)) {
          loadReviews()
        }
      }
    }

    // Tenter la synchronisation toutes les 30 secondes
    const interval = setInterval(syncLikes, 30000)

    // Synchroniser immédiatement au chargement
    syncLikes()

    return () => clearInterval(interval)
  }, [pendingLikes])

  const loadReviews = async () => {
    try {
      const data = await reviewService.getPublicReviews()
      setReviews(data.reviews || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const generateAvatar = (nom, prenom) =>
    `https://ui-avatars.com/api/?name=${nom[0]}${prenom[0]}&background=8b5a2b&color=fff&size=200&bold=true`

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const photo =
        photoPreview || generateAvatar(formData.nom, formData.prenom)

      if (editingReview) {
        // Modification
        await reviewService.updateReview(editingReview._id, visitorId, {
          message: formData.message,
          photo,
        })
      } else {
        // Création
        await reviewService.createReview({
          visitorId,
          ...formData,
          photo,
        })

        // Sauvegarder dans localStorage
        localStorage.setItem('user_nom', formData.nom)
        localStorage.setItem('user_prenom', formData.prenom)
        localStorage.setItem('user_photo', photo)
      }

      setFormData({ nom: '', prenom: '', message: '' })
      setPhotoPreview(null)
      setShowForm(false)
      setEditingReview(null)
      loadReviews()
    } catch (err) {
      console.error(err)
      alert(err.message || "Erreur lors de l'opération")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (review) => {
    setEditingReview(review)
    setFormData({
      nom: review.nom,
      prenom: review.prenom,
      message: review.message,
    })
    setPhotoPreview(review.photo)
    setShowForm(true)
    setOpenMenuId(null)
  }

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      return
    }

    try {
      await reviewService.deleteReview(reviewId, visitorId)
      loadReviews()
      setOpenMenuId(null)
    } catch (err) {
      console.error(err)
      alert(err.message || 'Erreur lors de la suppression')
    }
  }

  const handleToggleLike = async (reviewId) => {
    // Déterminer l'action (like ou unlike)
    const review = reviews.find((r) => r._id === reviewId)
    if (!review) return

    const currentlyLiked = getLikeState(review)
    const action = currentlyLiked ? 'unlike' : 'like'

    // Ajouter immédiatement en attente (optimistic update)
    addPendingLike(reviewId, action)

    // Tenter la synchronisation en arrière-plan
    try {
      await reviewService.toggleLikeReview(reviewId, visitorId)
      // Succès : supprimer de la liste d'attente
      removePendingLike(reviewId)
      // Recharger pour avoir les données exactes du serveur
      loadReviews()
    } catch (err) {
      console.error('Erreur like (sera réessayé):', err)
      // L'erreur est normale si hors ligne - le like reste en attente
    }
  }

  const toggleExpand = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }))
  }

  const cancelEdit = () => {
    setEditingReview(null)
    setFormData({ nom: '', prenom: '', message: '' })
    setPhotoPreview(null)
    setShowForm(false)
  }

  const formatRelativeDate = (date) => {
    if (!date) return "à l'instant"

    const now = new Date()
    const postDate = new Date(date)
    const diffInSeconds = Math.floor((now - postDate) / 1000)

    if (diffInSeconds < 60) {
      return `il y a ${diffInSeconds}s`
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `il y a ${minutes}min`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `il y a ${hours}h`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `il y a ${days}j`
    } else if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800)
      return `il y a ${weeks}sem`
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000)
      return `il y a ${months}mois`
    } else {
      const years = Math.floor(diffInSeconds / 31536000)
      return `il y a ${years}an${years > 1 ? 's' : ''}`
    }
  }

  const isOwner = (review) => review.visitorId === visitorId

  const shouldTruncate = (message) => message.length > 200

  return (
    <section className='review-section'>
      <div className='review-container'>
        {/* HEADER */}
        <div className='review-header'>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='36'
              height='36'
              viewBox='0 0 24 24'
              fill='none'
              stroke='#FFA500'
              strokeWidth='2'
            >
              <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
              <path d='M12 6l1.55 3.13L17 9.27l-2.5 2.44.59 3.44L12 13.89 8.91 15.15l.59-3.44L7 9.27l3.45-.14L12 6z' />
            </svg>
            <h2 className='review-title'>AVIS DE NOS CLIENTS</h2>
          </div>
          <button
            onClick={() => {
              if (showForm && editingReview) {
                cancelEdit()
              } else {
                setShowForm(!showForm)
              }
            }}
            className='btn-add-review'
          >
            {showForm ? 'Annuler' : 'Ajouter un avis'}
          </button>
        </div>

        {/* FORMULAIRE */}
        {showForm && (
          <div className='review-form-container'>
            <h3 className='form-title'>
              {editingReview ? 'Modifier votre avis' : 'Votre avis'}
            </h3>
            <form onSubmit={handleSubmit} className='review-form'>
              {!editingReview && (
                <div className='form-row'>
                  <input
                    name='nom'
                    placeholder='Nom'
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    className='form-input'
                    disabled={editingReview}
                  />
                  <input
                    name='prenom'
                    placeholder='Prénom'
                    required
                    value={formData.prenom}
                    onChange={handleChange}
                    className='form-input'
                    disabled={editingReview}
                  />
                </div>
              )}

              <textarea
                name='message'
                placeholder='Partagez votre expérience...'
                required
                value={formData.message}
                onChange={handleChange}
                className='form-textarea'
              />

              <div className='form-footer'>
                <div className='file-input-wrapper'>
                  <label className='file-label'>Photo (optionnelle)</label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handlePhotoChange}
                    className='file-input'
                  />
                </div>

                <button
                  type='submit'
                  disabled={submitting}
                  className='btn-submit'
                >
                  {submitting
                    ? 'En cours...'
                    : editingReview
                      ? 'Enregistrer'
                      : "Publier l'avis"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* AVIS */}
        {loading ? (
          <div className='loading-container'>
            <div className='loading-spinner'></div>
            <p className='loading-text'>Chargement des avis...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className='empty-state'>
            <p className='empty-state-text'>
              Aucun avis pour le moment. Soyez le premier à partager votre
              expérience !
            </p>
          </div>
        ) : (
          <div className='reviews-list'>
            {reviews.map((review) => {
              const hasLiked = getLikeState(review)
              const likeCount = getLikeCount(review)
              const owner = isOwner(review)
              const isExpanded = expandedReviews[review._id]
              const needsTruncation = shouldTruncate(review.message)

              return (
                <div key={review._id} className='review-card'>
                  {/* Photo de profil */}
                  <img
                    src={review.photo}
                    alt={`${review.prenom} ${review.nom}`}
                    className='review-avatar'
                  />

                  {/* Contenu */}
                  <div className='review-content'>
                    <div className='review-header-info'>
                      <h3 className='review-author'>
                        {review.prenom} {review.nom}
                      </h3>
                      <div className='review-header-right'>
                        <span className='review-date'>
                          {formatRelativeDate(review.createdAt)}
                        </span>

                        {/* Menu 3 points (visible uniquement par le propriétaire) */}
                        {owner && (
                          <div className='menu-container'>
                            <button
                              className='menu-trigger'
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenMenuId(
                                  openMenuId === review._id ? null : review._id,
                                )
                              }}
                            >
                              <DotsMenuIcon />
                            </button>

                            {openMenuId === review._id && (
                              <div className='menu-dropdown' ref={menuRef}>
                                <button
                                  className='menu-item'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEdit(review)
                                  }}
                                >
                                  Modifier
                                </button>
                                <button
                                  className='menu-item delete'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(review._id)
                                  }}
                                >
                                  Supprimer
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='review-text-content'>
                      <p
                        className={`review-message ${
                          needsTruncation && !isExpanded ? 'truncated' : ''
                        }`}
                      >
                        {review.message}
                      </p>

                      {needsTruncation && (
                        <button
                          className='see-more-btn'
                          onClick={() => toggleExpand(review._id)}
                        >
                          {isExpanded ? 'Voir moins' : '...Voir plus'}
                        </button>
                      )}

                      {/* Pouce like en bas à droite */}
                      <div className='review-footer'>
                        <button
                          className={`like-button ${hasLiked ? 'liked' : ''}`}
                          onClick={() => handleToggleLike(review._id)}
                        >
                          <ThumbIcon filled={hasLiked} />
                          <span className='like-count'>{likeCount}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default ReviewSection
