import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import * as reviewService from '../services/reviewService'
import ConfirmModal from './ConfirmModal'
import './styles/AdminReviews.css'

const STATUS_LABELS = { pending: 'En attente', approved: 'Approuvé', rejected: 'Rejeté' }
const STATUS_CLASSES = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' }

const AdminReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    loadReviews()
  }, [statusFilter, page])

  const loadReviews = async (showLoading = true) => {
    const start = showLoading ? Date.now() : 0
    if (showLoading) setLoading(true)
    try {
      const data = await reviewService.getAdminReviews({ status: statusFilter || undefined, page, limit: 20 })
      setReviews(data.reviews || [])
      setTotalPages(data.totalPages || 1)
      setTotal(data.total || 0)
    } catch (err) {
      console.error(err)
    } finally {
      if (showLoading) {
        const elapsed = Date.now() - start
        setTimeout(() => setLoading(false), Math.max(0, 300 - elapsed))
      }
    }
  }

  const handleModerate = async (reviewId, status) => {
    try {
      await reviewService.moderateReview(reviewId, status)
      loadReviews(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (reviewId) => {
    try {
      await reviewService.adminDeleteReview(reviewId)
      loadReviews(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleStatusFilter = (newStatus) => {
    setStatusFilter(newStatus)
    setPage(1)
  }

  return (
    <div className='admin-reviews'>
      <div className='admin-reviews-banner'>
        <div className='admin-reviews-banner-content'>
          <Link to='/admin/dashboard' className='admin-back-btn'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M19 12H5M12 19l-7-7 7-7' />
            </svg>
            Tableau de bord
          </Link>
          <div className='banner-title-row'>
            <div className='banner-icon'>
              <svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' />
              </svg>
            </div>
            <div>
              <h2>Avis Clients</h2>
              <p className='banner-subtitle'>Gérez et modérez les avis de vos clients</p>
            </div>
          </div>
        </div>
      </div>
      <div className='admin-reviews-stats-bar'>
        <span className='admin-reviews-count'>{total} avis</span>
      </div>

      <div className='admin-reviews-filters'>
        {['', 'pending', 'approved', 'rejected'].map((s) => (
          <button
            key={s}
            className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
            onClick={() => handleStatusFilter(s)}
          >
            {s ? STATUS_LABELS[s] : 'Tous'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className='loading-container'>
          <div className='loading-spinner'></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className='empty-state'>
          <p>Aucun avis trouvé.</p>
        </div>
      ) : (
        <div className='admin-reviews-table-wrapper'>
          <table className='admin-reviews-table'>
            <thead>
              <tr>
                <th>Auteur</th>
                <th>Note</th>
                <th>Message</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td className='cell-author'>
                    <div className='review-mini-avatar'>
                      {review.prenom?.[0]}{review.nom?.[0]}
                    </div>
                    <span>{review.prenom} {review.nom}</span>
                  </td>
                  <td className='cell-note'>
                    <span className='note-stars'>
                      {'★'.repeat(review.note || 5)}{'☆'.repeat(5 - (review.note || 5))}
                    </span>
                  </td>
                  <td className='cell-message'>
                    <p className='review-msg-truncated'>{review.message}</p>
                  </td>
                  <td className='cell-date'>
                    {new Date(review.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className='cell-status'>
                    <span className={`status-badge ${STATUS_CLASSES[review.status] || ''}`}>
                      {STATUS_LABELS[review.status] || review.status}
                    </span>
                  </td>
                  <td className='cell-actions'>
                    {review.status !== 'approved' && (
                      <button className='action-btn approve' onClick={() => handleModerate(review._id, 'approved')}
                        title="Approuver">
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                          <path d='M20 6L9 17l-5-5' />
                        </svg>
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button className='action-btn reject' onClick={() => handleModerate(review._id, 'rejected')}
                        title="Rejeter">
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                          <path d='M18 6L6 18M6 6l12 12' />
                        </svg>
                      </button>
                    )}
                    {review.status !== 'pending' && (
                      <button className='action-btn pending' onClick={() => handleModerate(review._id, 'pending')}
                        title="Remettre en attente">
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                          <circle cx='12' cy='12' r='10' /><path d='M12 6v6l4 2' />
                        </svg>
                      </button>
                    )}
                    <button className='action-btn delete' onClick={() => setConfirmDelete(review._id)}
                      title="Supprimer">
                      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <path d='M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2' />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className='pagination'>
          <button className='page-btn' onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Précédent</button>
          <span className='page-info'>Page {page} / {totalPages}</span>
          <button className='page-btn' onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Suivant</button>
        </div>
      )}
      <ConfirmModal
        isOpen={!!confirmDelete}
        message='Supprimer cet avis définitivement ?'
        confirmText='Supprimer'
        onConfirm={() => { handleDelete(confirmDelete); setConfirmDelete(null) }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}

export default AdminReviews
