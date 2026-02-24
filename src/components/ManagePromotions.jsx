import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import * as promotionService from '../services/promotionService'
import * as categoryService from '../services/categoryService'
import AdminLayout from './AdminLayout'
import './styles/ManagePromotions.css'

const ManagePromotions = () => {
  const [promotions, setPromotions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentPromo, setCurrentPromo] = useState(null)

  const [formData, setFormData] = useState({
    type: 'stock-limite',
    nom: '',
    dateDebut: '',
    dateFin: '',
    categorie: '',
    gains: [''],
    dureeAffichage: 10,
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (success) setTimeout(() => setSuccess(null), 3000)
  }, [success])

  const loadData = async () => {
    try {
      setLoading(true)
      const [promosData, catsData] = await Promise.all([
        promotionService.getAllPromotions(),
        categoryService.getAllCategories(),
      ])
      setPromotions(promosData.promotions || [])
      setCategories(catsData.categories || [])
      setError(null)
    } catch (err) {
      console.error('Erreur:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (promo = null) => {
    if (promo) {
      setEditMode(true)
      setCurrentPromo(promo)
      setFormData({
        type: promo.type,
        nom: promo.nom,
        dateDebut: new Date(promo.dateDebut).toISOString().slice(0, 16),
        dateFin: new Date(promo.dateFin).toISOString().slice(0, 16),
        categorie: promo.categorie?._id || '',
        gains: promo.gains || [''],
        dureeAffichage: promo.dureeAffichage || 10,
      })
    } else {
      setEditMode(false)
      setCurrentPromo(null)
      setFormData({
        type: 'stock-limite',
        nom: '',
        dateDebut: '',
        dateFin: '',
        categorie: '',
        gains: [''],
        dureeAffichage: 10,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditMode(false)
    setCurrentPromo(null)
    setError(null)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleGainChange = (index, value) => {
    const newGains = [...formData.gains]
    newGains[index] = value
    setFormData({ ...formData, gains: newGains })
  }

  const addGain = () => {
    setFormData({ ...formData, gains: [...formData.gains, ''] })
  }

  const removeGain = (index) => {
    const newGains = formData.gains.filter((_, i) => i !== index)
    setFormData({ ...formData, gains: newGains })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const data = {
        ...formData,
        gains:
          formData.type === 'tombola'
            ? formData.gains.filter((g) => g.trim())
            : undefined,
        categorie:
          formData.type === 'stock-limite' ? formData.categorie : undefined,
      }

      if (editMode && currentPromo) {
        await promotionService.updatePromotion(currentPromo._id, data)
        setSuccess('Promotion modifiée avec succès')
      } else {
        await promotionService.createPromotion(data)
        setSuccess('Promotion créée avec succès')
      }

      handleCloseModal()
      loadData()
    } catch (err) {
      console.error('Erreur:', err)
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette promotion ?')) return

    try {
      await promotionService.deletePromotion(id)
      setSuccess('Promotion supprimée')
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleToggle = async (id) => {
    try {
      await promotionService.togglePromotion(id)
      setSuccess('Statut modifié')
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  // Icône cadeau pour le titre
  const GiftIcon = () => (
    <svg
      width='28'
      height='28'
      viewBox='0 0 24 24'
      fill='#EC4899'
      style={{ verticalAlign: 'middle', marginRight: '12px' }}
    >
      <path d='M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35L12 4l-.5-.65C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z' />
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

  // Icône cadeau vide
  const EmptyGiftIcon = () => (
    <svg
      width='60'
      height='60'
      viewBox='0 0 24 24'
      fill='#9CA3AF'
      style={{ marginBottom: '16px' }}
    >
      <path d='M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35L12 4l-.5-.65C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z' />
    </svg>
  )

  // Icône plus
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

  // Icône boîte pour stock limité
  const BoxIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='#8B5CF6'
      style={{ verticalAlign: 'middle', marginRight: '6px' }}
    >
      <path d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z' />
    </svg>
  )

  // Icône dé pour tombola
  const DiceIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='#F59E0B'
      style={{ verticalAlign: 'middle', marginRight: '6px' }}
    >
      <path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z' />
      <circle cx='8.5' cy='8.5' r='1.5' />
      <circle cx='15.5' cy='8.5' r='1.5' />
      <circle cx='15.5' cy='15.5' r='1.5' />
      <circle cx='8.5' cy='15.5' r='1.5' />
    </svg>
  )

  // Icône check pour badge
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

  // Icône pause/pause
  const PauseIcon = () => (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='#F59E0B'>
      <path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' />
    </svg>
  )

  // Icône play
  const PlayIcon = () => (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='#10B981'>
      <path d='M8 5v14l11-7z' />
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

  // Icône crayon modal
  const EditModalIcon = () => (
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

  // Icône plus modal
  const PlusModalIcon = () => (
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

  // Icône croix fermeture
  const CrossCloseIcon = () => (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='#6B7280'>
      <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
    </svg>
  )

  // Icône croix gain
  const CrossGainIcon = () => (
    <svg width='12' height='12' viewBox='0 0 24 24' fill='#DC2626'>
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
      <div className='manage-promotions'>
        <div className='page-header'>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center' }}>
              <GiftIcon />
              Gestion des Promotions
            </h1>
            <p>Créez et gérez vos promotions</p>
          </div>
          <button
            className='btn-primary'
            onClick={() => handleOpenModal()}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <PlusIcon />
            Nouvelle Promotion
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

        {promotions.length === 0 ? (
          <div className='empty-state'>
            <EmptyGiftIcon />
            <h3>Aucune promotion</h3>
            <p>Créez votre première promotion</p>
            <button
              className='btn-primary'
              onClick={() => handleOpenModal()}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <PlusIcon />
              Créer une promotion
            </button>
          </div>
        ) : (
          <div className='promotions-grid'>
            {promotions.map((promo) => (
              <div key={promo._id} className={`promo-card ${promo.type}`}>
                <div className='card-header'>
                  <h3>{promo.nom}</h3>
                  <span
                    className={`badge ${promo.actif ? 'active' : 'inactive'}`}
                  >
                    {promo.actif ? (
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
                  <div className='promo-type'>
                    <span className='type-badge'>
                      {promo.type === 'stock-limite' ? (
                        <>
                          <BoxIcon />
                          Service en promotion
                        </>
                      ) : (
                        <>
                          <DiceIcon />
                          Tombola
                        </>
                      )}
                    </span>
                  </div>

                  {promo.type === 'stock-limite' && promo.categorie && (
                    <div className='promo-category'>
                      <strong>Service:</strong> {promo.categorie.nom}
                    </div>
                  )}

                  {promo.type === 'tombola' && promo.gains && (
                    <div className='promo-gains'>
                      <strong>Gains ({promo.gains.length}):</strong>
                      <ul>
                        {promo.gains.slice(0, 3).map((gain, i) => (
                          <li key={i}>{gain}</li>
                        ))}
                        {promo.gains.length > 3 && <li>...</li>}
                      </ul>
                    </div>
                  )}

                  <div className='promo-dates'>
                    <div>
                      <strong>Début:</strong>{' '}
                      {new Date(promo.dateDebut).toLocaleDateString('fr-FR')}
                    </div>
                    <div>
                      <strong>Fin:</strong>{' '}
                      {new Date(promo.dateFin).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>

                <div className='card-actions'>
                  <button
                    className='btn-action btn-toggle'
                    onClick={() => handleToggle(promo._id)}
                  >
                    {promo.actif ? <PauseIcon /> : <PlayIcon />}
                  </button>
                  <button
                    className='btn-action btn-edit'
                    onClick={() => handleOpenModal(promo)}
                  >
                    <PencilIcon />
                  </button>
                  <button
                    className='btn-action btn-delete'
                    onClick={() => handleDelete(promo._id)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className='modal-overlay' onClick={handleCloseModal}>
            <div className='modal-content' onClick={(e) => e.stopPropagation()}>
              <div className='modal-header'>
                <h3 style={{ display: 'flex', alignItems: 'center' }}>
                  {editMode ? (
                    <>
                      <EditModalIcon />
                      Modifier Promotion
                    </>
                  ) : (
                    <>
                      <PlusModalIcon />
                      Nouvelle Promotion
                    </>
                  )}
                </h3>
                <button className='btn-close' onClick={handleCloseModal}>
                  <CrossCloseIcon />
                </button>
              </div>

              <form onSubmit={handleSubmit} className='promo-form'>
                <div className='form-group'>
                  <label>Type de promotion *</label>
                  <select
                    name='type'
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value='stock-limite'>
                      <BoxIcon />
                      Service en promotion
                    </option>
                    <option value='tombola'>
                      <DiceIcon />
                      Tombola
                    </option>
                  </select>
                </div>

                <div className='form-group'>
                  <label>Nom de la promotion *</label>
                  <input
                    type='text'
                    name='nom'
                    value={formData.nom}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='form-row'>
                  <div className='form-group'>
                    <label>Date de début *</label>
                    <input
                      type='datetime-local'
                      name='dateDebut'
                      value={formData.dateDebut}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label>Date de fin *</label>
                    <input
                      type='datetime-local'
                      name='dateFin'
                      value={formData.dateFin}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {formData.type === 'stock-limite' && (
                  <div className='form-group'>
                    <label>Service concerné *</label>
                    <select
                      name='categorie'
                      value={formData.categorie}
                      onChange={handleChange}
                      required
                    >
                      <option value=''>Choisir un Services</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.type === 'tombola' && (
                  <>
                    <div className='form-group'>
                      <label>Gains possibles *</label>
                      {formData.gains.map((gain, index) => (
                        <div key={index} className='gain-input-group'>
                          <input
                            type='text'
                            value={gain}
                            onChange={(e) =>
                              handleGainChange(index, e.target.value)
                            }
                            placeholder='Ex: Un Dîner en couple'
                            required
                          />
                          {formData.gains.length > 1 && (
                            <button
                              type='button'
                              className='btn-remove-gain'
                              onClick={() => removeGain(index)}
                            >
                              <CrossGainIcon />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type='button'
                        className='btn-add-gain'
                        onClick={addGain}
                      >
                        + Ajouter un gain
                      </button>
                    </div>

                    <div className='form-group'>
                      <label>Durée d'affichage (secondes)</label>
                      <input
                        type='number'
                        name='dureeAffichage'
                        value={formData.dureeAffichage}
                        onChange={handleChange}
                        min='5'
                        max='60'
                      />
                    </div>
                  </>
                )}

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
    </AdminLayout>
  )
}

export default ManagePromotions
