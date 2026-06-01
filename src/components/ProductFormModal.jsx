import React from 'react'
import './styles/ProductFormModal.css'

const ProductFormModal = ({
  title,
  imageUrl,
  formData,
  onChange,
  onSubmit,
  onClose,
  closeIcon,
  isSubmitting,
}) => {
  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h3 className='modal-title'>{title}</h3>
          <button className='btn-close' onClick={onClose}>
            {closeIcon}
          </button>
        </div>

        <form onSubmit={onSubmit} className='product-form'>
          {imageUrl && (
            <div className='form-image-preview'>
              <img src={imageUrl} alt='Aperçu' />
            </div>
          )}

          <div className='form-group'>
            <label>Nom du produit *</label>
            <input
              type='text'
              name='nom'
              value={formData.nom}
              onChange={onChange}
              required
              placeholder='Ex: Coupe homme'
            />
          </div>

          <div className='form-group'>
            <label>Prix *</label>
            <input
              type='number'
              name='prix'
              value={formData.prix}
              onChange={onChange}
              required
              min='0'
              step='0.01'
              placeholder='0'
            />
          </div>

          <div className='form-group'>
            <label>Description</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={onChange}
              rows='3'
              placeholder='Décrivez le produit...'
            />
          </div>

          <div className='modal-actions'>
            <button type='button' className='btn-secondary' onClick={onClose}>
              Annuler
            </button>
            <button type='submit' className='btn-primary' disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormModal
