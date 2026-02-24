import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import * as publicService from '../services/publicService'
import Navbar from './Navbar'
import Footer from './footer/Footer'
import './styles/PublicCategoriesList.css'

const PublicCategoriesList = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await publicService.getPublicCategories()
      setCategories(data.categories || [])
      setError(null)
    } catch (err) {
      console.error('Erreur:', err)
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  // Icône d'erreur SVG
  const ErrorIcon = () => (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <circle cx='12' cy='12' r='10' />
      <line x1='12' y1='8' x2='12' y2='12' />
      <circle cx='12' cy='16' r='0.5' fill='currentColor' />
    </svg>
  )

  // Icône d'outils SVG (beauté/coiffure)
  const BeautyToolsIcon = () => (
    <svg
      width='64'
      height='64'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
    >
      <path d='M12 2v4M12 22v-4M4 12H2M22 12h-2M6 6L5 5M18 18l1 1M6 18l-1 1M18 6l1-1' />
      <circle cx='12' cy='12' r='4' />
      <path d='M8 12h8' />
    </svg>
  )

  // Icône de dossier/catégorie SVG
  const CategoryIcon = () => (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      fontSize='20px'
    >
      <path d='M20 7h-7l-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z' />
      <path d='M2 9h20' />
    </svg>
  )

  if (loading) {
    return (
      <>
        <Navbar categories={[]} />
        <div className='loading-container'>
          <div className='spinner'></div>
          <p>Chargement de nos services...</p>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar categories={[]} />
        <div className='error-container'>
          <p>
            <ErrorIcon /> {error}
          </p>
          <button onClick={loadCategories}>Réessayer</button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar categories={categories} />
      <div className='public-categories-page'>
        <div className='categories-hero'>
          <h1>
            <CategoryIcon />
            Nos Services
          </h1>
          <p>Découvrez toutes nos prestations par Services</p>
        </div>

        <div className='categories-container'>
          {categories.length === 0 ? (
            <div className='empty-state'>
              <div className='empty-icon'>
                <BeautyToolsIcon />
              </div>
              <h3>Aucune prestation disponible</h3>
              <p>Nos services seront bientôt disponibles...</p>
              <Link to='/' className='btn-home'>
                Retour à l'accueil
              </Link>
            </div>
          ) : (
            <div className='categories-grid'>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className='category-card'
                >
                  {category.images && category.images.length > 0 && (
                    <div className='category-image'>
                      <img
                        src={category.images[0].url}
                        alt={category.nom}
                        loading='lazy'
                      />
                      <div className='overlay'>
                        <span className='view-text'>
                          Voir les prestations →
                        </span>
                      </div>
                    </div>
                  )}

                  <div className='category-info'>
                    <h3>{category.nom}</h3>
                    {category.description && (
                      <p className='category-description'>
                        {category.description}
                      </p>
                    )}
                    <div className='category-meta'>
                      <span className='product-count'>
                        {category.nombreImages}{' '}
                        {category.nombreImages > 1
                          ? 'prestations'
                          : 'prestation'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PublicCategoriesList
