import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import * as publicService from '../services/publicService'
import { getOptimizedImageUrl } from '../services/apiConfig'
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

  useEffect(() => { loadCategory() }, [slug])

  const loadCategory = async () => {
    const start = Date.now()
    setLoading(true)
    try {
      const data = await publicService.getCategoryBySlug(slug)
      setCategory(data.category)
      setProducts(data.category.images || [])
      setError(null)
    } catch (err) {
      setError('Catégorie introuvable')
    } finally {
      const elapsed = Date.now() - start
      setTimeout(() => setLoading(false), Math.max(0, 300 - elapsed))
    }
  }

  const handleOrderClick = (e, product) => {
    e.stopPropagation()
    navigate('/order', { state: { product } })
  }

  if (loading) {
    return (
      <>
        <Navbar categories={[]} />
        <div className='loading-container'><div className='spinner'></div><p>Chargement...</p></div>
      </>
    )
  }

  if (error || !category) {
    return (
      <>
        <Navbar categories={[]} />
        <div className='error-container'>
          <p>{error}</p>
          <Link to='/categories' className='btn-back'>Toutes les catégories</Link>
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
            <Link to='/accueil'>Accueil</Link><span>›</span>
            <Link to='/categories'>Services</Link><span>›</span>
            <span>{category.nom}</span>
          </div>
          <h1>{category.nom}</h1>
          {category.description && <p>{category.description}</p>}
          <div className='category-stats'>
            <span>{products.length} prestation{products.length > 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className='products-container'>
          {products.length === 0 ? (
            <div className='empty-state'>
              <h3>Aucun produit</h3>
              <p>Ce Service ne contient pas encore de produits.</p>
              <Link to='/categories' className='btn-back'>Tous les Services</Link>
            </div>
          ) : (
            <div className='products-grid'>
              {products.map((product) => (
                <div key={product._id} className='product-card' onClick={() => setSelectedProduct(product)}>
                  <div className='product-image'>
                    <img src={getOptimizedImageUrl(product.url, { width: 400, quality: 80 })} alt={product.nom || 'Produit'} loading='lazy' decoding='async' />
                    {!product.enStock && <div className='stock-badge out'>Rupture de stock</div>}
                  </div>
                  <div className='product-info'>
                    <h3>{product.nom || 'Sans nom'}</h3>
                    <div className='product-price'>
                      {product.prix > 0 ? `${product.prix.toLocaleString()} ${product.devise || 'FCFA'}` : 'Prix sur demande'}
                    </div>
                    <button className='btn-order' onClick={(e) => handleOrderClick(e, product)} disabled={!product.enStock}>
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
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      <Footer />
    </>
  )
}

export default CategoryProducts
