import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import * as publicService from '../services/publicService'
import Navbar from '../components/Navbar'
import Footer from './footer/Footer'
import ProductModal from '../components/ProductModal'
import './styles/CategoryProducts.css'

const CategoryProducts = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    loadCategory()
  }, [slug])

  const loadCategory = async () => {
    try {
      setLoading(true)
      const data = await publicService.getCategoryBySlug(slug)
      setCategory(data.category)
      setProducts(data.category.images || [])
      setError(null)
    } catch (err) {
      console.error('Erreur:', err)
      setError('Catégorie introuvable')
    } finally {
      setLoading(false)
    }
  }

  const handleOrderClick = (e, product) => {
    e.stopPropagation()
    navigate('/order', { state: { product } })
  }

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

  // Icône boîte pour état vide
  const BoxIcon = () => (
    <svg
      width='60'
      height='60'
      viewBox='0 0 24 24'
      fill='#9CA3AF'
      style={{ marginBottom: '16px' }}
    >
      <path d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z' />
    </svg>
  )

  // Icône bois pour le matériau
  const WoodIcon = () => (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='#8B5A2B'
      style={{ verticalAlign: 'middle', marginRight: '6px' }}
    >
      <path d='M4 22h16v2H4z' />
      <path d='M18 2h-2v2H8V2H6v2H4v2h2v14h12V4h2V2h-2zM8 18H6V4h2v14zm10 0H8v2h10v-2zm0-14h-2v2h2V4zm0 4h-2v2h2V8zm-4-4h-2v2h2V4zm0 4h-2v2h2V8z' />
    </svg>
  )

  // Icône flèche gauche
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

  if (loading) {
    return (
      <>
        <Navbar categories={[]} />
        <div className='loading-container'>
          <div className='spinner'></div>
          <p>Chargement...</p>
        </div>
      </>
    )
  }

  if (error || !category) {
    return (
      <>
        <Navbar categories={[]} />
        <div className='error-container'>
          <p style={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon />
            {error}
          </p>
          <Link
            to='/categories'
            className='btn-back'
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeftIcon />
            Toutes les catégories
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar categories={[]} />
      <div className='category-products-page'>
        <div className='category-header'>
          <div className='breadcrumb'>
            <Link to='/'>Accueil</Link>
            <span>›</span>
            <Link to='/categories'>Services</Link>
            <span>›</span>
            <span>{category.nom}</span>
          </div>
          <h1>{category.nom}</h1>
          {category.description && <p>{category.description}</p>}
          <div className='category-stats'>
            <span>
              {products.length} prestation{products.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className='products-container'>
          {products.length === 0 ? (
            <div className='empty-state'>
              <BoxIcon />
              <h3>Aucun produit</h3>
              <p>Ce Service ne contient pas encore de produits.</p>
              <Link
                to='/categories'
                className='btn-back'
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <ArrowLeftIcon />
                Tous les Services
              </Link>
            </div>
          ) : (
            <div className='products-grid'>
              {products.map((product) => (
                <div
                  key={product._id}
                  className='product-card'
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className='product-image'>
                    <img
                      src={product.url}
                      alt={product.nom || 'Produit'}
                      loading='lazy'
                    />
                    {!product.enStock && (
                      <div className='stock-badge out'>Rupture de stock</div>
                    )}
                  </div>

                  <div className='product-info'>
                    <h3>{product.nom || 'Sans nom'}</h3>

                    <div className='product-price'>
                      {product.prix > 0
                        ? `${product.prix.toLocaleString()} ${product.devise || 'FCFA'}`
                        : 'Prix sur demande'}
                    </div>

                    <button
                      className='btn-order'
                      onClick={(e) => handleOrderClick(e, product)}
                      disabled={!product.enStock}
                    >
                      {product.enStock ? 'En savoir plus' : 'Indisponible'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <Footer />
    </>
  )
}

export default CategoryProducts
