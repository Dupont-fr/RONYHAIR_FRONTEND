import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import * as categoryService from '../services/categoryService'
import * as imageService from '../services/imageService'
import AdminLayout from '../components/AdminLayout'
import ConfirmModal from './ConfirmModal'
import ProductFormModal from './ProductFormModal'
import './styles/ManageImages.css'

const ManageImages = () => {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [category, setCategory] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)
  const [tempImageUrl, setTempImageUrl] = useState(null)
  const [tempPublicId, setTempPublicId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [productForm, setProductForm] = useState({
    nom: '',
    prix: '',
    description: '',
  })

  useEffect(() => {
    loadData()
  }, [categoryId])

  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(null), 3000)
    }
  }, [success])

  const loadData = async (showLoading = true) => {
    const start = showLoading ? Date.now() : 0
    if (showLoading) setLoading(true)
    try {
      const categoryData = await categoryService.getCategoryById(categoryId)
      setCategory(categoryData.category)

      const imagesData = await imageService.getCategoryImages(categoryId)
      setImages(imagesData.images || [])

      setError(null)
    } catch (err) {
      console.error('Erreur chargement:', err)
      setError('Erreur lors du chargement des données')
    } finally {
      if (showLoading) {
        const elapsed = Date.now() - start
        setTimeout(() => setLoading(false), Math.max(0, 300 - elapsed))
      }
    }
  }

  const resetForm = () => {
    setProductForm({
      nom: '',
      prix: '',
      description: '',
    })
    setTempImageUrl(null)
    setTempPublicId(null)
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const { url, publicId } = await imageService.uploadImageToCloudinary(
        file,
        (progress) => setUploadProgress(progress),
      )

      setTempImageUrl(url)
      setTempPublicId(publicId)
      setShowAddModal(true)
    } catch (err) {
      console.error('Erreur upload:', err)
      setError(err.message || "Erreur lors de l'upload")
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setProductForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmitProduct = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const imageData = {
        url: tempImageUrl,
        publicId: tempPublicId,
        nom: productForm.nom,
        prix: parseFloat(productForm.prix) || 0,
        description: productForm.description,
        ordre: images.length,
      }

      await imageService.addImageToCategory(categoryId, imageData)
      setSuccess('Produit ajouté avec succès')
      setShowAddModal(false)
      resetForm()
      loadData()
    } catch (err) {
      console.error('Erreur ajout produit:', err)
      setError(err.message)
    }
  }

  const handleEditImage = (image) => {
    setCurrentImage(image)
    setProductForm({
      nom: image.nom || '',
      prix: image.prix || '',
      description: image.description || '',
    })
    setShowEditModal(true)
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setError(null)
    setIsSubmitting(true)
    try {
      const updateData = {
        nom: productForm.nom,
        prix: parseFloat(productForm.prix) || 0,
        description: productForm.description,
      }

      await imageService.updateImage(currentImage._id, updateData)
      setSuccess('Produit modifié avec succès')
      setShowEditModal(false)
      setCurrentImage(null)
      resetForm()
      loadData(false)
    } catch (err) {
      console.error('Erreur modification:', err)
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (imageId, publicId) => {
    try {
      await imageService.deleteImage(imageId)
      setSuccess('Produit supprimé avec succès')
      loadData(false)
    } catch (err) {
      console.error('Erreur suppression:', err)
      setError(err.message)
    }
  }

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', index.toString())
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'))

    if (dragIndex === dropIndex) return

    const newImages = [...images]
    const [draggedImage] = newImages.splice(dragIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)
    setImages(newImages)

    try {
      const imageIds = newImages.map((img) => img._id)
      await imageService.reorderImages(categoryId, imageIds)
      setSuccess('Ordre modifié avec succès')
    } catch (err) {
      console.error('Erreur réorganisation:', err)
      setError('Erreur lors de la réorganisation')
      loadData()
    }
  }

  const CameraIcon = () => (
    <svg
      width='28'
      height='28'
      viewBox='0 0 24 24'
      fill='#3B82F6'
      style={{ verticalAlign: 'middle', marginRight: '12px' }}
    >
      <path d='M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z' />
    </svg>
  )

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

  const UploadIcon = () => (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='#3B82F6'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z' />
    </svg>
  )

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

  const FrameIcon = () => (
    <svg
      width='60'
      height='60'
      viewBox='0 0 24 24'
      fill='#9CA3AF'
      style={{ marginBottom: '16px' }}
    >
      <path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' />
    </svg>
  )

  const LightbulbIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='#F59E0B'
      style={{ verticalAlign: 'middle', marginRight: '6px' }}
    >
      <path d='M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z' />
    </svg>
  )

  const PencilIcon = () => (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='#3B82F6'>
      <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
    </svg>
  )

  const TrashIcon = () => (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='#DC2626'>
      <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
    </svg>
  )

  const EyeIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='currentColor'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' />
    </svg>
  )

  const CheckIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='currentColor'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
    </svg>
  )

  const ArrowLeftIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='currentColor'
      style={{ verticalAlign: 'middle', marginRight: '8px' }}
    >
      <path d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z' />
    </svg>
  )

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

  const CrossIcon = () => (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='#6B7280'>
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

  if (!category) {
    return (
      <AdminLayout>
        <div className='error-container'>
          <p style={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon />
            Catégorie introuvable
          </p>
          <Link to='/admin/categories' className='btn-primary'>
            Retour aux Services
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <>
    <AdminLayout>
      <div className='manage-images'>
        <div className='page-header'>
          <div>
            <Link
              to='/admin/categories'
              className='breadcrumb'
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <ArrowLeftIcon />
              Services
            </Link>
            <h1 style={{ display: 'flex', alignItems: 'center' }}>
              <CameraIcon />
              {category.nom}
            </h1>
            <p>Gérez les produits de cette Services</p>
          </div>
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

        <div className='upload-section'>
          <div className='upload-zone'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              disabled={uploading}
            />

            <button
              className='btn-upload'
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {uploading ? (
                <>
                  <div className='upload-spinner'></div>
                  <span>Upload en cours... {uploadProgress}%</span>
                </>
              ) : (
                <>
                  <UploadIcon />
                  <span>Ajouter un produit</span>
                </>
              )}
            </button>

            {uploading && (
              <div className='upload-progress'>
                <div
                  className='upload-progress-bar'
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className='upload-info'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <InfoIcon />
              <h4>Informations</h4>
            </div>
            <ul>
              <li>Formats acceptés : JPG, PNG, WebP</li>
              <li>Taille maximale : 10 MB</li>
              <li>Vous pourrez ajouter le nom, prix, etc. après l'upload</li>
              <li>Glissez-déposez pour réorganiser</li>
            </ul>
          </div>
        </div>

        {images.length === 0 ? (
          <div className='empty-state'>
            <FrameIcon />
            <h3>Aucun produit</h3>
            <p>Commencez par ajouter des produits à ce service</p>
          </div>
        ) : (
          <div className='images-section'>
            <div className='section-header'>
              <h3>Produits ({images.length})</h3>
              <p
                className='hint'
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <LightbulbIcon />
                Glissez-déposez pour réorganiser
              </p>
            </div>

            <div className='images-grid'>
              {images.map((image, index) => (
                <div
                  key={image._id}
                  className='image-card'
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className='image-number'>{index + 1}</div>

                  <div className='image-preview'>
                    <img
                      src={image.url}
                      alt={image.nom || `Produit ${index + 1}`}
                    />
                  </div>

                  <div className='image-info'>
                    <h4>{image.nom || 'Sans nom'}</h4>
                    <p className='price'>
                      {image.prix > 0
                        ? `${image.prix.toLocaleString()} ${image.devise}`
                        : 'Prix sur demande'}
                    </p>
                  </div>

                  <div className='image-actions'>
                    <button
                      className='btn-edit-image'
                      onClick={() => handleEditImage(image)}
                      title='Modifier'
                    >
                      <PencilIcon />
                    </button>
                    <button
                      className='btn-delete-image'
                      onClick={() => setConfirmDelete({ id: image._id, publicId: image.publicId })}
                      title='Supprimer'
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  <div className='drag-handle' title="Glisser l'image ici">
                    ⋮⋮
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showAddModal && (
          <ProductFormModal
            title={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <PlusIcon />
                Ajouter un produit
              </span>
            }
            imageUrl={tempImageUrl}
            formData={productForm}
            onChange={handleFormChange}
            onSubmit={handleSubmitProduct}
            onClose={() => {
              setShowAddModal(false)
              resetForm()
            }}
            closeIcon={<CrossIcon />}
            isSubmitting={isSubmitting}
          />
        )}

        {showEditModal && currentImage && (
          <ProductFormModal
            title={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <EditIcon />
                Modifier le produit
              </span>
            }
            imageUrl={currentImage.url}
            formData={productForm}
            onChange={handleFormChange}
            onSubmit={handleUpdateProduct}
            onClose={() => {
              setShowEditModal(false)
              setCurrentImage(null)
              resetForm()
            }}
            closeIcon={<CrossIcon />}
            isSubmitting={isSubmitting}
          />
        )}

        <div className='action-footer'>
          <Link
            to='/accueil'
            target='_blank'
            className='btn-secondary'
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <EyeIcon />
            Prévisualiser le site
          </Link>
          <Link
            to='/admin/categories'
            className='btn-primary'
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <CheckIcon />
            Terminé
          </Link>
        </div>
      </div>
    </AdminLayout>
    <ConfirmModal
      isOpen={!!confirmDelete}
      message='Êtes-vous sûr de vouloir supprimer ce produit ?'
      confirmText='Supprimer'
      onConfirm={() => { handleDelete(confirmDelete.id, confirmDelete.publicId); setConfirmDelete(null) }}
      onCancel={() => setConfirmDelete(null)}
    />
  </>
  )
}

export default ManageImages
