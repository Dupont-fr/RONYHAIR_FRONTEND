import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router'
import * as analyticsService from '../services/analyticsService'
import './styles/OrderPage.css'

const OrderPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { product } = location.state || {}

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    ville: '',
  })

  const [submitting, setSubmitting] = useState(false)

  if (!product) {
    return (
      <div className='order-page-wrapper'>
        <header className='order-page-header'>
          <div className='order-page-header-content'>
            <Link to='/' className='brand-link'>
              <h1 className='brand-name'>RONY HAIR 237</h1>
              <p className='brand-subtitle'>INSTITUT DE BEAUTÉ MIXTE</p>
            </Link>
          </div>
        </header>

        <div className='order-page'>
          <div className='order-error'>
            <div className='error-icon'>⚠️</div>
            <h2>Service introuvable</h2>
            <p>
              Veuillez sélectionner une prestation depuis la page d'accueil.
            </p>
            <Link to='/' className='btn-back-home'>
              ← Retour à l'accueil
            </Link>
          </div>
        </div>

        <footer className='order-page-footer'>
          <p>&copy; {new Date().getFullYear()} RONY HAIR 237</p>
        </footer>
      </div>
    )
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const messageTexte = `*NOUVELLE COMMANDE*
        *Produit:* ${product.nom}
        *Prix:* ${
          product.prix > 0
            ? `${product.prix.toLocaleString()} ${product.devise}`
            : 'Sur demande'
        }
        *Client:* ${formData.nom} ${formData.prenom}
        Tél: ${formData.telephone}
        Adresse: ${formData.adresse}
        Ville: ${formData.ville}
        *Voir l'image:* ${product.url}`

      const phoneNumber = '237696409306'
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(messageTexte)}`
      window.open(whatsappUrl, '_blank')

      // ✅ TRACKER LA COMMANDE
      await analyticsService.trackCommande(
        product._id,
        product.nom,
        product.categorie,
        'Catégorie',
      )

      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      console.error('Erreur:', error)
      alert("Erreur lors de l'envoi")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='order-page-wrapper'>
      <header className='order-page-header'>
        <div className='order-page-header-content'>
          <Link to='/' className='brand-link'>
            <h1 className='brand-name'> RONY HAIR 237</h1>
            <p className='brand-subtitle'>Institut de Beauté & Bien-être</p>
          </Link>
          <Link to='/' className='btn-back-home-header'>
            ← Accueil
          </Link>
          {/* <div className='stock-badge'>
            {product.enStock ? 'En stock' : 'Sur commande'}
          </div> */}
        </div>
      </header>

      <div className='order-page'>
        <div className='order-container'>
          {/* Product Card */}
          <div className='product-card'>
            <h2 className='product-name'>{product.nom}</h2>

            <div className='product-image'>
              <img src={product.url} alt={product.nom} />
            </div>

            <div className='product-info'>
              <div className='info-row'>
                <span className='info-label'>PRIX:</span>
                <span className='info-value price'>
                  {product.prix > 0
                    ? `${product.prix.toLocaleString()} ${product.devise || 'FCFA'}`
                    : 'Sur demande'}
                </span>
              </div>

              {product.description && (
                <p className='product-description'>{product.description}</p>
              )}
            </div>
          </div>

          {/* Form */}
          <div className='form-card'>
            <h3>Vos informations</h3>
            <br />
            <form onSubmit={handleSubmit}>
              {/* Ligne 1: Nom + Prénom */}
              <div className='form-row-2col'>
                <div className='form-labels-row'>
                  <label className='col-label'>Nom *</label>
                  <label className='col-label'>Prénom *</label>
                </div>
                <div className='form-inputs-row'>
                  <input
                    type='text'
                    name='nom'
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    placeholder='Votre nom'
                  />
                  <input
                    type='text'
                    name='prenom'
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                    placeholder='Votre prénom'
                  />
                </div>
              </div>

              {/* Ligne 2: Téléphone + Ville */}
              <div className='form-row-2col'>
                <div className='form-labels-row'>
                  <label className='col-label'>Numéro téléphone *</label>
                  <label className='col-label'>Ville *</label>
                </div>
                <div className='form-inputs-row'>
                  <input
                    type='tel'
                    name='telephone'
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                    placeholder='+237 6XX XXX XXX'
                  />
                  <input
                    type='text'
                    name='ville'
                    value={formData.ville}
                    onChange={handleChange}
                    required
                    placeholder='Douala, Yaoundé...'
                  />
                </div>
              </div>

              {/* Ligne 3: Adresse */}
              <div className='form-row-full'>
                <label>Adresse *</label>
                <input
                  type='text'
                  name='adresse'
                  value={formData.adresse}
                  onChange={handleChange}
                  required
                  placeholder='Votre adresse complète'
                />
              </div>

              {/* Bouton Submit */}
              <button
                type='submit'
                className='btn-submit'
                style={{ background: '#0F1B3D' }}
                disabled={submitting}
              >
                {submitting ? (
                  'Envoi en cours...'
                ) : (
                  <>
                    <svg
                      className='wa-icon'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                    >
                      <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
                    </svg>
                    Continuer sur WhatsApp
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className='order-page-footer'>
        <p>
          &copy; {new Date().getFullYear()} RONY HAIR 237 - Institut de Beauté &
          Bien-être
        </p>
      </footer>
    </div>
  )
}

export default OrderPage
