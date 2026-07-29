import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import * as authService from '../services/authService'
import './styles/AdminLogin.css'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await authService.loginAdmin(formData)
      if (data.success) {
        navigate('/admin/categories')
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion')
    } finally { setLoading(false) }
  }

  return (
    <div className='admin-login-container'>
      <div className='login-box'>
        <div className='login-header'>
          <h1>Connexion Admin</h1>
          <p>Espace Administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className='login-form'>
          {error && <div className='alert alert-error'><span>{error}</span></div>}

          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' name='email' value={formData.email} onChange={handleChange}
              placeholder='admin@example.com' required autoComplete='email' />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Mot de passe</label>
            <div className='password-input-container'>
              <input type={showPassword ? 'text' : 'password'} id='password' name='password'
                value={formData.password} onChange={handleChange} placeholder='••••••••'
                required autoComplete='current-password' className='password-input' />
              <button type='button' className='password-toggle-btn'
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                <svg width='22' height='22' viewBox='0 0 24 24' fill='none'
                  stroke={showPassword ? '#8B5A2B' : '#666'} strokeWidth='2'
                  strokeLinecap='round' strokeLinejoin='round'>
                  {showPassword ? (
                    <><path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' /><line x1='1' y1='1' x2='23' y2='23' strokeWidth='2.5' /></>
                  ) : (
                    <><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' /><circle cx='12' cy='12' r='3' /></>
                  )}
                </svg>
              </button>
            </div>
          </div>

          <button type='submit' className='btn-login' disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className='login-footer'>
          <p><Link to='/accueil'>← Retour au site</Link></p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
