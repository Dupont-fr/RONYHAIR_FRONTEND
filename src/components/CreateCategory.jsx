import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import * as categoryService from '../services/categoryService'
import AdminLayout from '../components/AdminLayout'
import './styles/CreateCategory.css'

const CreateCategory = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nom: '',
    ordre: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await categoryService.createCategory({
        nom: formData.nom.trim(),
        ordre: parseInt(formData.ordre) || 0,
      })

      if (data.success) {
        // Rediriger vers la page de gestion des images de cette catégorie
        navigate(`/admin/categories/${data.category._id}/images`)
      }
    } catch (err) {
      console.error('Erreur création:', err)
      setError(err.message || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  // Icône plus pour le titre
  const PlusIcon = () => (
    <svg
      width='28'
      height='28'
      viewBox='0 0 24 24'
      fill='#10B981'
      style={{ verticalAlign: 'middle', marginRight: '12px' }}
    >
      <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' />
    </svg>
  )

  // Icône warning pour les erreurs
  const WarningIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#DC2626'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' />
    </svg>
  )

  // Icône info
  const InfoIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#3B82F6'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' />
    </svg>
  )

  // Icône appareil photo pour l'aperçu
  const CameraIcon = () => (
    <svg
      width='40'
      height='40'
      viewBox='0 0 24 24'
      fill='#9CA3AF'
      style={{ marginBottom: '12px' }}
    >
      <path d='M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z' />
    </svg>
  )

  return (
    <AdminLayout>
      <div className='create-category'>
        <div className='page-header'>
          <h1 style={{ display: 'flex', alignItems: 'center' }}>
            <PlusIcon />
            Nouveau Service
          </h1>
          <p>Créez un Service pour organiser vos produits</p>
        </div>

        <div className='form-container'>
          <form onSubmit={handleSubmit} className='category-form'>
            {error && (
              <div className='alert alert-error'>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <WarningIcon />
                  {error}
                </span>
              </div>
            )}

            <div className='form-group'>
              <label htmlFor='nom'>
                Nom du Service <span className='required'>*</span>
              </label>
              <input
                type='text'
                id='nom'
                name='nom'
                value={formData.nom}
                onChange={handleChange}
                placeholder='Ex: Coiffure Homme...'
                required
                autoFocus
              />
              <small className='form-hint'>
                Le nom sera visible sur votre site public
              </small>
            </div>

            <div className='form-group'>
              <label htmlFor='ordre'>Ordre d'affichage</label>
              <input
                type='number'
                id='ordre'
                name='ordre'
                value={formData.ordre}
                onChange={handleChange}
                min='0'
              />
              <small className='form-hint'>
                Plus le numéro est petit, plus le service apparaît en premier
              </small>
            </div>

            <div className='form-actions'>
              <button
                type='button'
                className='btn-secondary'
                onClick={() => navigate('/admin/categories')}
              >
                Annuler
              </button>
              <button type='submit' className='btn-primary' disabled={loading}>
                {loading ? 'Création...' : 'Créer et ajouter des images'}
              </button>
            </div>

            <div className='info-box'>
              <div style={{ display: 'flex' }}>
                <div style={{ flexShrink: 0, marginRight: '12px' }}>
                  <InfoIcon />
                </div>
                <div>
                  <strong>Prochaine étape :</strong>
                  <p>
                    Après la création, vous pourrez ajouter des images à ce
                    Service.
                  </p>
                </div>
              </div>
            </div>
          </form>

          <div className='preview-box'>
            <h3>Aperçu</h3>
            <div className='preview-content'>
              {formData.nom ? (
                <div className='preview-category'>
                  <h4>{formData.nom}</h4>
                  <div className='preview-placeholder'>
                    <CameraIcon />
                    <p>Les images apparaîtront ici</p>
                  </div>
                </div>
              ) : (
                <div className='preview-empty'>
                  <p>Entrez un nom pour voir l'aperçu</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default CreateCategory
