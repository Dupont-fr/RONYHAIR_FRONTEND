import React, { useEffect, useState } from 'react'
import * as adminUserService from '../services/adminUserService'
import * as authService from '../services/authService'
import AdminLayout from './AdminLayout'
import ConfirmModal from './ConfirmModal'
import './styles/ManageAdmins.css'

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({ nom: '', email: '', password: '', role: 'admin' })
  const [submitting, setSubmitting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const currentAdmin = authService.getAdminFromStorage()

  useEffect(() => { loadAdmins() }, [])
  useEffect(() => { if (success) setTimeout(() => setSuccess(null), 3000) }, [success])

  const loadAdmins = async (showLoading = true) => {
    const start = showLoading ? Date.now() : 0
    if (showLoading) setLoading(true)
    try {
      const data = await adminUserService.getAdmins()
      setAdmins(data.admins || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      if (showLoading) {
        const elapsed = Date.now() - start
        setTimeout(() => setLoading(false), Math.max(0, 300 - elapsed))
      }
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await adminUserService.createAdmin(formData)
      setSuccess('Administrateur créé avec succès')
      setFormData({ nom: '', email: '', password: '', role: 'admin' })
      loadAdmins(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (adminId) => {
    try {
      await adminUserService.toggleAdminStatus(adminId)
      setSuccess('Statut modifié')
      loadAdmins(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (adminId, nom) => {
    try {
      await adminUserService.deleteAdmin(adminId)
      setSuccess('Administrateur supprimé')
      loadAdmins(false)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className='loading-container'><div className='spinner'></div><p>Chargement...</p></div>
      </AdminLayout>
    )
  }

  return (
    <>
    <AdminLayout>
      <div className='manage-admins'>
        <div className='page-header'>
          <div>
            <h1>Gestion des Administrateurs</h1>
            <p>Créez et gérez les comptes administrateurs</p>
          </div>
        </div>

        {error && <div className='alert alert-error'>{error}</div>}
        {success && <div className='alert alert-success'>{success}</div>}

        <div className='admin-form-card'>
          <h2>Créer un nouvel administrateur</h2>
          <form onSubmit={handleSubmit} className='admin-create-form'>
            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='nom'>Nom *</label>
                <input type='text' id='nom' name='nom' value={formData.nom} onChange={handleChange} placeholder='Nom complet' required />
              </div>
              <div className='form-group'>
                <label htmlFor='email'>Email *</label>
                <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} placeholder='email@exemple.com' required />
              </div>
            </div>
            <div className='form-row'>
              <div className='form-group'>
                <label htmlFor='password'>Mot de passe *</label>
                <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} placeholder='Min. 6 caractères' required minLength='6' />
              </div>
              <div className='form-group'>
                <label htmlFor='role'>Rôle</label>
                <select id='role' name='role' value={formData.role} onChange={handleChange}>
                  <option value='admin'>Admin</option>
                  <option value='super_admin'>Super Admin</option>
                </select>
              </div>
            </div>
            <button type='submit' className='btn-primary' disabled={submitting}>
              {submitting ? 'Création...' : 'Créer l\'administrateur'}
            </button>
          </form>
        </div>

        <div className='admin-list-card'>
          <h2>Administrateurs existants</h2>
          <div className='admins-table-wrapper'>
            <table className='admins-table'>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr><td colSpan='5' className='empty-cell'>Aucun administrateur</td></tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id}>
                      <td>{admin.nom}</td>
                      <td>{admin.email}</td>
                      <td><span className={`role-badge ${admin.role === 'super_admin' ? 'role-super' : 'role-admin'}`}>{admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span></td>
                      <td><span className={`status-badge ${admin.actif ? 'active' : 'inactive'}`}>{admin.actif ? 'Actif' : 'Inactif'}</span></td>
                      <td className='cell-actions'>
                        {admin.id !== currentAdmin?.id && (
                          <>
                            <button className={`action-btn ${admin.actif ? 'toggle-off' : 'toggle-on'}`} onClick={() => handleToggleStatus(admin.id)} title={admin.actif ? 'Désactiver' : 'Activer'}>
                              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                {admin.actif ? <path d='M6 18L18 6M6 6l12 12' /> : <path d='M8 5v14l11-7z' />}
                              </svg>
                            </button>
                            <button className='action-btn delete' onClick={() => setConfirmDelete({ id: admin.id, nom: admin.nom })} title='Supprimer'>
                              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                                <path d='M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2' />
                              </svg>
                            </button>
                          </>
                        )}
                        {admin.id === currentAdmin?.id && <span className='you-badge'>Vous</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
    <ConfirmModal
      isOpen={!!confirmDelete}
      message={`Supprimer l'administrateur "${confirmDelete?.nom}" ?`}
      confirmText='Supprimer'
      onConfirm={() => { handleDelete(confirmDelete.id, confirmDelete.nom); setConfirmDelete(null) }}
      onCancel={() => setConfirmDelete(null)}
    />
  </>
  )
}

export default ManageAdmins
