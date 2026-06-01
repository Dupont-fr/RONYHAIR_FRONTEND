import React, { useEffect, useState, useRef } from 'react'
import * as reviewService from '../services/reviewService'
import { getVisitorId } from '../services/analyticsService'
import { useOptimisticLikes, syncPendingLikes } from '../hooks/useOptimisticLikes'
import { uploadImageToCloudinary } from '../services/imageService'
import ConfirmModal from './ConfirmModal'
import './styles/ReviewSection.css'

const StarRating = ({ value, onChange, readonly, size }) => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`star ${i <= value ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
        style={{ fontSize: size || 20 }}
        onClick={() => { if (!readonly && onChange) onChange(i) }}
      >
        {i <= value ? '\u2605' : '\u2606'}
      </span>,
    )
  }
  return <div className='star-rating'>{stars}</div>
}

const ReviewSection = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [expandedReviews, setExpandedReviews] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalReviews, setTotalReviews] = useState(0)
  const [avatarErrors, setAvatarErrors] = useState({})
  const [confirmDelete, setConfirmDelete] = useState(null)
  const menuRef = useRef(null)

  const visitorId = getVisitorId()
  const { pendingLikes, addPendingLike, removePendingLike, getLikeState, getLikeCount } = useOptimisticLikes(visitorId)

  const [formData, setFormData] = useState({ nom: '', prenom: '', message: '', note: 5, photo: '' })
  const [photoUploading, setPhotoUploading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const savedNom = localStorage.getItem('user_nom')
    const savedPrenom = localStorage.getItem('user_prenom')
    if (savedNom && savedPrenom) {
      setFormData((prev) => ({ ...prev, nom: savedNom, prenom: savedPrenom }))
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => { loadReviews(1) }, [])

  useEffect(() => {
    const syncLikes = async () => {
      if (Object.keys(pendingLikes).length === 0) return
      const results = await syncPendingLikes(pendingLikes, reviewService.toggleLikeReview)
      results.forEach(({ reviewId, success }) => { if (success) removePendingLike(reviewId) })
      if (results.some((r) => r.success)) loadReviews(currentPage, false)
    }
    const interval = setInterval(syncLikes, 30000)
    syncLikes()
    return () => clearInterval(interval)
  }, [pendingLikes])

  const loadReviews = async (page = 1, showLoading = true) => {
    const start = showLoading ? Date.now() : 0
    if (showLoading) setLoading(true)
    try {
      const data = await reviewService.getPublicReviews(page, 10)
      setReviews(data.reviews || [])
      setTotalPages(data.totalPages || 1)
      setTotalReviews(data.totalReviews || 0)
      setCurrentPage(data.currentPage || page)
      setLoadError(null)
    } catch (err) {
      console.error(err)
      setLoadError("Impossible de charger les avis")
    }
    finally {
      if (showLoading) {
        const elapsed = Date.now() - start
        setTimeout(() => setLoading(false), Math.max(0, 300 - elapsed))
      }
    }
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    loadReviews(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('La photo ne doit pas dépasser 5 Mo.')
      e.target.value = ''
      return
    }
    setPhotoUploading(true)
    try {
      const { url } = await uploadImageToCloudinary(file, null, 'reviews')
      setFormData((prev) => ({ ...prev, photo: url }))
    } catch {
      alert("Erreur lors du téléchargement de la photo")
    } finally {
      setPhotoUploading(false)
      e.target.value = ''
    }
  }

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.message.length < 10) {
      alert('Le message doit contenir au moins 10 caractères.')
      return
    }
    setSubmitting(true)
    try {
      if (editingReview) {
        await reviewService.updateReview(editingReview._id, visitorId, { message: formData.message, note: formData.note })
      } else {
        await reviewService.createReview({ visitorId, ...formData })
        localStorage.setItem('user_nom', formData.nom)
        localStorage.setItem('user_prenom', formData.prenom)
      }
      setFormData({ nom: '', prenom: '', message: '', note: 5, photo: '' })
      setShowForm(false)
      setEditingReview(null)
      loadReviews(1, false)
      setSuccessMessage('Avis envoyé avec succès ! Il sera publié après modération.')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (err) {
      alert(err.message || "Erreur lors de l'opération")
    } finally { setSubmitting(false) }
  }

  const handleEdit = (review) => {
    setEditingReview(review)
    setFormData({ nom: review.nom, prenom: review.prenom, message: review.message, note: review.note, photo: review.photo || '' })
    setShowForm(true)
    setOpenMenuId(null)
  }

  const handleDelete = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId, visitorId)
      loadReviews(currentPage, false)
      setOpenMenuId(null)
    } catch (err) { alert(err.message || 'Erreur lors de la suppression') }
  }

  const handleToggleLike = (reviewId) => {
    const review = reviews.find((r) => r._id === reviewId)
    if (!review) return
    const currentlyLiked = getLikeState(review)
    addPendingLike(reviewId, currentlyLiked ? 'unlike' : 'like')
  }

  const toggleExpand = (reviewId) => {
    setExpandedReviews((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }))
  }

  const cancelEdit = () => {
    setEditingReview(null)
    setFormData({ nom: '', prenom: '', message: '', note: 5, photo: '' })
    setShowForm(false)
  }

  const formatRelativeDate = (date) => {
    if (!date) return "à l'instant"
    const now = new Date()
    const postDate = new Date(date)
    const diffInSeconds = Math.floor((now - postDate) / 1000)
    if (diffInSeconds < 60) return `il y a ${diffInSeconds}s`
    if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)}min`
    if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `il y a ${Math.floor(diffInSeconds / 86400)}j`
    if (diffInSeconds < 2592000) return `il y a ${Math.floor(diffInSeconds / 604800)}sem`
    if (diffInSeconds < 31536000) return `il y a ${Math.floor(diffInSeconds / 2592000)}mois`
    return `il y a ${Math.floor(diffInSeconds / 31536000)}an${Math.floor(diffInSeconds / 31536000) > 1 ? 's' : ''}`
  }

  const isOwner = (review) => review.visitorId === visitorId
  const shouldTruncate = (message) => message.length > 200

  const handleAvatarError = (reviewId) => {
    setAvatarErrors((prev) => ({ ...prev, [reviewId]: true }))
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    pages.push(
      <button key='prev' className='page-btn' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M15 18l-6-6 6-6' /></svg>
      </button>,
    )

    if (start > 1) {
      pages.push(<button key={1} className='page-btn' onClick={() => handlePageChange(1)}>1</button>)
      if (start > 2) pages.push(<span key='dots1' className='page-dots'>...</span>)
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button key={i} className={`page-btn ${i === currentPage ? 'active' : ''}`} onClick={() => handlePageChange(i)}>
          {i}
        </button>,
      )
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key='dots2' className='page-dots'>...</span>)
      pages.push(<button key={totalPages} className='page-btn' onClick={() => handlePageChange(totalPages)}>{totalPages}</button>)
    }

    pages.push(
      <button key='next' className='page-btn' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M9 18l6-6-6-6' /></svg>
      </button>,
    )

    return <div className='pagination'>{pages}</div>
  }

  return (
    <section className='review-section'>
      <div className='review-container'>
        <div className='review-header'>
          <h2 className='review-title'>
            <svg width='28' height='28' viewBox='0 0 24 24' fill='#d81a88' stroke='none' style={{marginRight: '10px', verticalAlign: 'middle'}}>
              <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
            </svg>
            AVIS DE NOS CLIENTS
          </h2>
          <button onClick={() => { if (showForm && editingReview) cancelEdit(); else setShowForm(!showForm) }}
            className='btn-add-review'>
            {showForm ? 'Annuler' : 'Ajouter un avis'}
          </button>
        </div>

        {successMessage && (
          <div className='review-success-banner'>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='#2e7d32' style={{marginRight: '8px', flexShrink: 0}}>
              <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
            </svg>
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage('')} className='review-success-close'>&times;</button>
          </div>
        )}

        {showForm && (
          <div className='review-form-container'>
            <h3 className='form-title'>{editingReview ? 'Modifier votre avis' : 'Votre avis'}</h3>
            <form onSubmit={handleSubmit} className='review-form'>
              {!editingReview && (
                <div className='form-row'>
                  <input name='nom' placeholder='Nom' required value={formData.nom} onChange={handleChange}
                    className='form-input' disabled={editingReview} />
                  <input name='prenom' placeholder='Prénom' required value={formData.prenom} onChange={handleChange}
                    className='form-input' disabled={editingReview} />
                </div>
              )}
              <div className='form-note-row'>
                <label className='form-note-label'>Note :</label>
                <StarRating value={formData.note} onChange={(val) => setFormData({ ...formData, note: val })} size={28} />
              </div>
              <div className='form-photo-row'>
                <label className='form-photo-label'>Photo (optionnelle) :</label>
                <div className='form-photo-input-wrapper'>
                  <input type='file' accept='image/*' onChange={handlePhotoChange}
                    className='form-photo-input' id='review-photo' disabled={photoUploading} />
                  <label htmlFor='review-photo' className='form-photo-btn'>
                    {photoUploading ? 'Chargement...' : 'Choisir une photo'}
                  </label>
                </div>
                {formData.photo && (
                  <div className='form-photo-preview'>
                    <img src={formData.photo} alt='Aperçu' className='form-photo-img' />
                    <button type='button' onClick={handleRemovePhoto} className='form-photo-remove'>&times;</button>
                  </div>
                )}
              </div>
              <textarea name='message' placeholder='Partagez votre expérience... (min. 10 caractères)' required
                value={formData.message} onChange={handleChange} className='form-textarea' minLength={10} />
              <div className='form-footer'>
                <span className='form-char-count'>{formData.message.length}/1000</span>
                <button type='submit' disabled={submitting || formData.message.length < 10} className='btn-submit'>
                  {submitting ? 'En cours...' : editingReview ? 'Enregistrer' : "Publier l'avis"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className='review-loading'>
            <div className='review-spinner'></div>
            <p className='review-loading-text'>Chargement des avis...</p>
          </div>
        ) : loadError ? (
          <div className='empty-state'>
            <p className='empty-state-text'>{loadError}</p>
            <button className='btn-submit' style={{marginTop: '12px'}} onClick={() => loadReviews(1)}>Réessayer</button>
          </div>
        ) : reviews.length === 0 ? (
          <div className='empty-state'>
            <p className='empty-state-text'>Aucun avis pour le moment. Soyez le premier à partager votre expérience !</p>
          </div>
        ) : (
          <>
            <div className='reviews-count'>{totalReviews} avis</div>
            <div className='reviews-list'>
              {reviews.map((review) => {
                const hasLiked = getLikeState(review)
                const likeCount = getLikeCount(review)
                const owner = isOwner(review)
                const isExpanded = expandedReviews[review._id]
                const needsTruncation = shouldTruncate(review.message)
                const avatarBroken = avatarErrors[review._id]

                return (
                  <div key={review._id} className='review-card'>
                    {avatarBroken ? (
                      <div className='review-avatar-fallback'>
                        {review.prenom?.[0]}{review.nom?.[0]}
                      </div>
                    ) : (
                      <img
                        src={review.photo}
                        alt={`${review.prenom} ${review.nom}`}
                        className='review-avatar'
                        onError={() => handleAvatarError(review._id)}
                      />
                    )}
                    <div className='review-content'>
                      <div className='review-header-info'>
                        <div className='review-author-row'>
                          <h3 className='review-author'>{review.prenom} {review.nom}</h3>
                          <StarRating value={review.note || 5} readonly size={14} />
                        </div>
                        <div className='review-header-right'>
                          <span className='review-date'>{formatRelativeDate(review.createdAt)}</span>
                          {owner && (
                            <div className='menu-container'>
                              <button className='menu-trigger' onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === review._id ? null : review._id) }}>
                                <svg className='dots-icon' viewBox='0 0 24 24' fill='currentColor'>
                                  <circle cx='12' cy='5' r='2' /><circle cx='12' cy='12' r='2' /><circle cx='12' cy='19' r='2' />
                                </svg>
                              </button>
                              {openMenuId === review._id && (
                                <div className='menu-dropdown' ref={menuRef}>
                                  <button className='menu-item' onClick={(e) => { e.stopPropagation(); handleEdit(review) }}>Modifier</button>
                                   <button className='menu-item delete' onClick={(e) => { e.stopPropagation(); setConfirmDelete(review._id) }}>Supprimer</button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='review-text-content'>
                        <p className={`review-message ${needsTruncation && !isExpanded ? 'truncated' : ''}`}>{review.message}</p>
                        {needsTruncation && (
                          <button className='see-more-btn' onClick={() => toggleExpand(review._id)}>
                            {isExpanded ? 'Voir moins' : '...Voir plus'}
                          </button>
                        )}
                        <div className='review-footer'>
                          <button className={`like-button ${hasLiked ? 'liked' : ''}`} onClick={() => handleToggleLike(review._id)}>
                            <svg className={`thumb-icon ${hasLiked ? 'filled' : ''}`} viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                              <path d='M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z' />
                            </svg>
                            <span className='like-count'>{likeCount}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {renderPagination()}
          </>
        )}
      </div>
      <ConfirmModal
        isOpen={!!confirmDelete}
        message='Êtes-vous sûr de vouloir supprimer cet avis ?'
        confirmText='Supprimer'
        onConfirm={() => { handleDelete(confirmDelete); setConfirmDelete(null) }}
        onCancel={() => setConfirmDelete(null)}
      />
    </section>
  )
}

export default ReviewSection
