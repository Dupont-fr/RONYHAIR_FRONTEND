import axios from 'axios'

// const API_URL = 'http://localhost:3000/api/admin'
const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://rony-hair-237.onrender.com/api/admin'
    : 'http://localhost:3000/api/admin'

// ============================================
// CONFIGURATION AXIOS (avec credentials pour les cookies)
// ============================================

// Configuration axios pour inclure les cookies
axios.defaults.withCredentials = true

// Créer une instance axios avec la configuration de base
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============================================
// GESTION DU TOKEN (pour compatibilité)
// ============================================

export const getToken = () => {
  return localStorage.getItem('adminToken')
}

export const setToken = (token) => {
  localStorage.setItem('adminToken', token)
}

export const removeToken = () => {
  localStorage.removeItem('adminToken')
}

// ============================================
// GESTION DES INFOS ADMIN
// ============================================

export const getAdminFromStorage = () => {
  try {
    const adminInfo = localStorage.getItem('adminInfo')
    return adminInfo ? JSON.parse(adminInfo) : null
  } catch (error) {
    console.error('Erreur lecture admin storage:', error)
    return null
  }
}

export const setAdminToStorage = (adminData) => {
  try {
    localStorage.setItem('adminInfo', JSON.stringify(adminData))
  } catch (error) {
    console.error('Erreur sauvegarde admin storage:', error)
  }
}

export const removeAdminFromStorage = () => {
  try {
    localStorage.removeItem('adminInfo')
  } catch (error) {
    console.error('Erreur suppression admin storage:', error)
  }
}

// ============================================
// REQUÊTES API (TOUT EN AXIOS)
// ============================================

// Connexion administrateur
export const loginAdmin = async (credentials) => {
  try {
    const response = await apiClient.post('/login', credentials)

    // Sauvegarder les infos admin (le token est dans le cookie)
    if (response.data.success && response.data.admin) {
      setAdminToStorage(response.data.admin)
    }

    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Identifiants incorrects'
    throw new Error(message)
  }
}

// Déconnexion administrateur
export const logoutAdmin = async () => {
  try {
    const response = await apiClient.post('/logout')

    // Supprimer du localStorage
    removeToken()
    removeAdminFromStorage()

    return response.data
  } catch (error) {
    // Même en cas d'erreur, on supprime du localStorage
    removeToken()
    removeAdminFromStorage()
    throw error
  }
}

// Vérifier le statut de la session
export const checkAuthStatus = async () => {
  try {
    const response = await apiClient.get('/me')

    // Mettre à jour le localStorage
    if (response.data.success && response.data.admin) {
      setAdminToStorage(response.data.admin)
    }

    return response.data
  } catch (error) {
    // Session invalide, nettoyer le localStorage
    removeToken()
    removeAdminFromStorage()
    throw error
  }
}

// Créer le premier admin (À SUPPRIMER EN PRODUCTION)
export const createFirstAdmin = async (adminData) => {
  try {
    const response = await apiClient.post('/create-first', adminData)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Erreur création admin'
    throw new Error(message)
  }
}

// Vérifier si un admin existe
export const checkAdminExists = async (email) => {
  try {
    const response = await apiClient.post('/check-exists', { email })
    return response.data.exists
  } catch (error) {
    console.error('Erreur vérification admin:', error)
    return false
  }
}

// ============================================
// EXPORT PAR DÉFAUT
// ============================================

export default {
  loginAdmin,
  logoutAdmin,
  checkAuthStatus,
  createFirstAdmin,
  checkAdminExists,
  getToken,
  setToken,
  removeToken,
  getAdminFromStorage,
  setAdminToStorage,
  removeAdminFromStorage,
}
