import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import * as categoryService from '../services/categoryService'
import AdminLayout from '../components/AdminLayout'
import './styles/CategoriesList.css'

const CategoriesList = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

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

  const handleDelete = async (id, nom, nombreImages) => {
    if (nombreImages > 0) {
      alert(
        `Impossible de supprimer "${nom}". Cette catégorie contient ${nombreImages} image(s).`,
      )
      return
    }

    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir supprimer la catégorie "${nom}" ?`,
      )
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

  // Icône dossier pour le titre
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

  // Icône plus pour le bouton
  const PlusIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='#FFFFFF'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
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
      width='60'
      height='60'
      viewBox='0 0 24 24'
      fill='#9CA3AF'
      style={{ marginBottom: '16px' }}
    >
      <path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z' />
      <path d='M8 9h8v2H8z' />
    </svg>
  )

  // Icône cadre pour les images
  const FrameIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#8B5CF6'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' />
    </svg>
  )

  // Icône calendrier
  const CalendarIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#F59E0B'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' />
    </svg>
  )

  // Icône appareil photo
  const CameraIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='#3B82F6'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z' />
    </svg>
  )

  // Icône corbeille
  const TrashIcon = () => (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='#FFFFFF'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
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

  // Icône croix
  const CrossIcon = () => (
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
      <AdminLayout>
        <div className='loading-container'>
          <div className='spinner'></div>
          <p>Chargement...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className='categories-list'>
        <div className='page-header'>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center' }}>
              <FolderIcon />
              Gestion des Services
            </h1>
            <p>Organisez vos produits par Services</p>
          </div>
          <Link
            to='/admin/categories/new'
            className='btn-primary'
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <PlusIcon />
            Nouveau Service
          </Link>
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

        {categories.length === 0 ? (
          <div className='empty-state'>
            <EmptyBoxIcon />
            <h3>Aucun Service crée</h3>
            <p>Commencez par créer votre premier Service</p>
            <Link
              to='/admin/categories/new'
              className='btn-primary'
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <PlusIcon />
              Créer un Service
            </Link>
          </div>
        ) : (
          <div className='categories-grid'>
            {categories.map((category) => (
              <div key={category._id} className='category-card'>
                <div className='card-header'>
                  <h3>{category.nom}</h3>
                  <span
                    className={`status-badge ${category.actif ? 'active' : 'inactive'}`}
                  >
                    {category.actif ? (
                      <>
                        <CheckIcon />
                        Actif
                      </>
                    ) : (
                      <>
                        <CrossIcon />
                        Inactif
                      </>
                    )}
                  </span>
                </div>

                <div className='card-body'>
                  <div className='stat'>
                    <span className='stat-icon'>
                      <FrameIcon />
                    </span>
                    <div>
                      <p className='stat-value'>{category.nombreImages || 0}</p>
                      <p className='stat-label'>Images</p>
                    </div>
                  </div>

                  <div className='stat'>
                    <span className='stat-icon'>
                      <CalendarIcon />
                    </span>
                    <div>
                      <p className='stat-value'>
                        {new Date(category.createdAt).toLocaleDateString(
                          'fr-FR',
                        )}
                      </p>
                      <p className='stat-label'>Date de création</p>
                    </div>
                  </div>
                </div>

                <div className='card-actions'>
                  <Link
                    to={`/admin/categories/${category._id}/images`}
                    className='btn-action btn-primary-outline'
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <CameraIcon />
                    {/* Gérer les imagesAjouter */}Ajouter
                  </Link>

                  <button
                    className='btn-action btn-danger'
                    onClick={() =>
                      handleDelete(
                        category._id,
                        category.nom,
                        category.nombreImages,
                      )
                    }
                    disabled={category.nombreImages > 0}
                    title={
                      category.nombreImages > 0
                        ? "Supprimez d'abord toutes les images"
                        : 'Supprimer la catégorie'
                    }
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <TrashIcon />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default CategoriesList
