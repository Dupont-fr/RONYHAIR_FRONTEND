import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import * as categoryService from '../services/categoryService'
import * as authService from '../services/authService'
import './styles/CategoryManager.css'

const CategoryManager = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    image: '',
    ordre: 0,
  })

  // Récupérer les infos admin
  const admin = authService.getAdminFromStorage()

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(null), 3000)
    }
  }, [success])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoryService.getAllCategories()
      setCategories(data.categories || [])
      setError(null)
    } catch (err) {
      console.error('Erreur chargement catégories:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditMode(true)
      setCurrentCategory(category)
      setFormData({
        nom: category.nom,
        description: category.description || '',
        image: category.image || '',
        ordre: category.ordre || 0,
      })
    } else {
      setEditMode(false)
      setCurrentCategory(null)
      setFormData({
        nom: '',
        description: '',
        image: '',
        ordre: 0,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditMode(false)
    setCurrentCategory(null)
    setError(null)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      if (editMode && currentCategory) {
        await categoryService.updateCategory(currentCategory._id, formData)
        setSuccess('Catégorie modifiée avec succès')
      } else {
        await categoryService.createCategory(formData)
        setSuccess('Catégorie créée avec succès')
      }

      handleCloseModal()
      loadCategories()
    } catch (err) {
      console.error('Erreur:', err)
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (
      !window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')
    ) {
      return
    }

    try {
      await categoryService.deleteCategory(id)
      setSuccess('Catégorie supprimée avec succès')
      loadCategories()
    } catch (err) {
      console.error('Erreur suppression:', err)
      setError(err.message)
    }
  }

  const handleLogout = async () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      await authService.logoutAdmin()
      navigate('/admin/login')
    }
  }

  // Icône bûche de bois
  const WoodIcon = () => (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='#8B5A2B'
      style={{ verticalAlign: 'middle', marginRight: '12px' }}
    >
      <path d='M4 22h16v2H4z' />
      <path d='M18 2h-2v2H8V2H6v2H4v2h2v14h12V4h2V2h-2zM8 18H6V4h2v14zm10 0H8v2h10v-2zm0-14h-2v2h2V4zm0 4h-2v2h2V8zm-4-4h-2v2h2V4zm0 4h-2v2h2V8z' />
    </svg>
  )

  // Icône dossier
  const FolderIcon = () => (
    <svg
      width='28'
      height='28'
      viewBox='0 0 24 24'
      fill='#10B981'
      style={{ verticalAlign: 'middle', marginRight: '12px' }}
    >
      <path d='M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z' />
    </svg>
  )

  // Icône utilisateur
  const UserIcon = () => (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='#6B7280'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z' />
    </svg>
  )

  // Icône warning
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

  // Icône succès
  const SuccessIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#059669'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
    </svg>
  )

  // Icône boîte vide
  const EmptyBoxIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#9CA3AF'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z' />
      <path d='M8 9h8v2H8z' />
    </svg>
  )

  // Icône dossier placeholder
  const FolderPlaceholderIcon = () => (
    <svg width='48' height='48' viewBox='0 0 24 24' fill='#9CA3AF'>
      <path d='M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z' />
    </svg>
  )

  // Icône crayon
  const PencilIcon = () => (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='#3B82F6'>
      <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
    </svg>
  )

  // Icône corbeille
  const TrashIcon = () => (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='#DC2626'>
      <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
    </svg>
  )

  // Icône crayon pour modal
  const EditIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#3B82F6'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
    </svg>
  )

  // Icône plus pour modal
  const PlusIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#10B981'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' />
    </svg>
  )

  // Icône croix
  const CrossIcon = () => (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='#6B7280'>
      <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
    </svg>
  )

  // Icône check
  const CheckIcon = () => (
    <svg
      width='12'
      height='12'
      viewBox='0 0 24 24'
      fill='#059669'
      style={{ verticalAlign: 'middle', marginRight: '4px' }}
    >
      <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
    </svg>
  )

  // Icône croix pour badge
  const CrossBadgeIcon = () => (
    <svg
      width='12'
      height='12'
      viewBox='0 0 24 24'
      fill='#DC2626'
      style={{ verticalAlign: 'middle', marginRight: '4px' }}
    >
      <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
    </svg>
  )

  if (loading) {
    return (
      <div className='loading-container'>
        <div className='spinner'></div>
        <p>Chargement des Service...</p>
      </div>
    )
  }

  return (
    <div className='admin-layout'>
      {/* Header */}
      <header className='admin-header'>
        <div className='header-content'>
          <h1 style={{ display: 'flex', alignItems: 'center' }}>
            <WoodIcon />
            RONY HAIR 237 - Tableau de bord Admin
          </h1>
          <div className='header-actions'>
            <span
              className='admin-info'
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <UserIcon />
              {admin?.nom}
            </span>
            <button onClick={handleLogout} className='btn-logout'>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='admin-main'>
        <div className='category-manager'>
          <div className='manager-header'>
            <h2 style={{ display: 'flex', alignItems: 'center' }}>
              <FolderIcon />
              Gestion des Services
            </h2>
            <button className='btn-primary' onClick={() => handleOpenModal()}>
              + Nouveau Service
            </button>
          </div>

          {error && (
            <div className='alert alert-error'>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon />
                {error}
              </span>
            </div>
          )}

          {success && (
            <div className='alert alert-success'>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <SuccessIcon />
                {success}
              </span>
            </div>
          )}

          <div className='categories-grid'>
            {categories.length === 0 ? (
              <div className='empty-state'>
                <p style={{ display: 'flex', alignItems: 'center' }}>
                  <EmptyBoxIcon />
                  Aucun Service créée
                </p>
                <button
                  className='btn-primary'
                  onClick={() => handleOpenModal()}
                >
                  Créer le premier Service
                </button>
              </div>
            ) : (
              categories.map((category) => (
                <div key={category._id} className='category-card'>
                  <div className='category-image'>
                    {category.image ? (
                      <img src={category.image} alt={category.nom} />
                    ) : (
                      <div className='placeholder-image'>
                        <FolderPlaceholderIcon />
                      </div>
                    )}
                  </div>

                  <div className='category-info'>
                    {/* <h3>{category.nom}</h3> */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        color='blue'
                      >
                        <circle cx='8' cy='21' r='2'></circle>
                        <circle cx='20' cy='21' r='2'></circle>
                        <path d='M5.67 6H23l-1.68 8.39a2 2 0 0 1-2 1.61H8.75a2 2 0 0 1-2-1.74L5.23 2.74A2 2 0 0 0 3.25 1H1'></path>
                      </svg>
                      <h3>{category.nom}</h3>
                    </div>
                    <p className='category-slug'>/{category.slug}</p>
                    {category.description && (
                      <p className='category-description'>
                        {category.description}
                      </p>
                    )}
                    <div className='category-meta'>
                      <span className='badge'>
                        {category.nombreProduits || 0} produit(s)
                      </span>
                      <span
                        className={`badge ${category.actif ? 'active' : 'inactive'}`}
                      >
                        {category.actif ? (
                          <>
                            <CheckIcon />
                            Actif
                          </>
                        ) : (
                          <>
                            <CrossBadgeIcon />
                            Inactif
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className='category-actions'>
                    <button
                      className='btn-edit'
                      onClick={() => handleOpenModal(category)}
                      title='Modifier'
                    >
                      <PencilIcon />
                    </button>
                    <button
                      className='btn-delete'
                      onClick={() => handleDelete(category._id)}
                      title='Supprimer'
                      disabled={category.nombreProduits > 0}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className='modal-overlay' onClick={handleCloseModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h3 style={{ display: 'flex', alignItems: 'center' }}>
                {editMode ? (
                  <>
                    <EditIcon />
                    Modifier le Service
                  </>
                ) : (
                  <>
                    <PlusIcon />
                    Nouveau Service
                  </>
                )}
              </h3>
              <button className='btn-close' onClick={handleCloseModal}>
                <CrossIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='modal-form'>
              <div className='form-group'>
                <label htmlFor='nom'>Nom du Service *</label>
                <input
                  type='text'
                  id='nom'
                  name='nom'
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder='Ex: Coiffure Homme...'
                  required
                />
              </div>

              <div className='form-group'>
                <label htmlFor='description'>Description</label>
                <textarea
                  id='description'
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  placeholder='Description de la catégorie (optionnel)'
                  rows='3'
                />
              </div>

              <div className='form-group'>
                <label htmlFor='image'>URL de l'image</label>
                <input
                  type='url'
                  id='image'
                  name='image'
                  value={formData.image}
                  onChange={handleChange}
                  placeholder='https://...'
                />
                {formData.image && (
                  <div className='image-preview'>
                    <img src={formData.image} alt='Aperçu' />
                  </div>
                )}
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
                <small>
                  Plus le numéro est petit, plus la catégorie apparaît en
                  premier
                </small>
              </div>

              <div className='modal-actions'>
                <button
                  type='button'
                  className='btn-secondary'
                  onClick={handleCloseModal}
                >
                  Annuler
                </button>
                <button type='submit' className='btn-primary'>
                  {editMode ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryManager
