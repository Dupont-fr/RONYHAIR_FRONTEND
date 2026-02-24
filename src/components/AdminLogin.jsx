import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import * as authService from '../services/authService'
import './styles/AdminLogin.css'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // AJOUT : État pour gérer l'affichage du mot de passe
  const [showPassword, setShowPassword] = useState(false)

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
      const data = await authService.loginAdmin(formData)

      if (data.success) {
        console.log('Connexion réussie:', data.admin)
        navigate('/admin/categories')
      }
    } catch (err) {
      console.error('Erreur login:', err)
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  // AJOUT : Fonction pour basculer l'affichage du mot de passe
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Icône cadenas pour le titre
  const LockIcon = () => (
    <svg
      width='28'
      height='28'
      viewBox='0 0 24 24'
      fill='#8B5A2B'
      style={{ verticalAlign: 'middle', marginRight: '12px' }}
    >
      <path d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z' />
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

  // Icône flèche gauche pour le retour
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

  // AJOUT : Icône pour afficher/masquer le mot de passe
  const PasswordVisibilityIcon = ({ isVisible }) => (
    <svg
      width='22'
      height='22'
      viewBox='0 0 24 24'
      fill='none'
      stroke={isVisible ? '#8B5A2B' : '#666'}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      style={{ cursor: 'pointer', transition: 'stroke 0.3s' }}
    >
      {isVisible ? (
        <>
          {/* Icône œil barré (masquer) */}
          <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' />
          <line x1='1' y1='1' x2='23' y2='23' strokeWidth='2.5' />
        </>
      ) : (
        <>
          {/* Icône œil (afficher) */}
          <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
          <circle cx='12' cy='12' r='3' />
        </>
      )}
    </svg>
  )

  return (
    <div className='admin-login-container'>
      <div className='login-box'>
        <div className='login-header'>
          <h1 style={{ display: 'flex', alignItems: 'center' }}>
            <LockIcon />
            Connexion Admin
          </h1>
          <p>Menuiserie - Espace Administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className='login-form'>
          {error && (
            <div className='alert alert-error'>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon />
                {error}
              </span>
            </div>
          )}

          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='admin@example.com'
              required
              autoComplete='email'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Mot de passe</label>
            <div className='password-input-container'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='••••••••'
                required
                autoComplete='current-password'
                className='password-input'
              />
              {/* AJOUT : Bouton pour afficher/masquer le mot de passe */}
              <button
                type='button'
                className='password-toggle-btn'
                onClick={togglePasswordVisibility}
                aria-label={
                  showPassword
                    ? 'Masquer le mot de passe'
                    : 'Afficher le mot de passe'
                }
              >
                <PasswordVisibilityIcon isVisible={showPassword} />
              </button>
            </div>
          </div>

          <button type='submit' className='btn-login' disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className='login-footer'>
          <p>
            <a href='/' style={{ display: 'flex', alignItems: 'center' }}>
              <ArrowLeftIcon />
              Retour au site
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
