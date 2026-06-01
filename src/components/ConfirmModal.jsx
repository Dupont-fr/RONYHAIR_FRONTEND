import React, { useEffect, useRef } from 'react'
import './styles/ConfirmModal.css'

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel, confirmText = 'Confirmer', cancelText = 'Annuler', variant = 'danger' }) => {
  const confirmRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => confirmRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Enter') onConfirm()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onConfirm, onCancel])

  if (!isOpen) return null

  return (
    <div className='confirm-overlay' onClick={onCancel}>
      <div className='confirm-modal' onClick={(e) => e.stopPropagation()}>
        <div className='confirm-icon-wrapper'>
          <svg width='40' height='40' viewBox='0 0 24 24' fill={variant === 'danger' ? '#d81a88' : '#0f1b3d'}>
            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' />
          </svg>
        </div>
        <p className='confirm-message'>{message}</p>
        <div className='confirm-actions'>
          <button ref={confirmRef} className='confirm-btn confirm-btn--danger' onClick={onConfirm}>{confirmText}</button>
          <button className='confirm-btn confirm-btn--cancel' onClick={onCancel}>{cancelText}</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
