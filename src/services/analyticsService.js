import axios from 'axios'
import { getToken } from './authService'

// const API_URL = '/api/admin/analytics'
const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://gaetan-bois.onrender.com/api/admin/analytics'
    : '/api/admin/analytics'

const getAuthHeaders = () => {
  const token = getToken()
  if (!token) return { 'Content-Type': 'application/json' }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

// Configuration pour inclure le token dans les requêtes
const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
})

// ============================================
// GESTION DE L'ID VISITEUR getDashboardStats
// ============================================

// Générer un ID unique pour le visiteur
const generateVisitorId = () => {
  return `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Récupérer ou créer l'ID visiteur
export const getVisitorId = () => {
  let visitorId = localStorage.getItem('visitorId')

  if (!visitorId) {
    visitorId = generateVisitorId()
    localStorage.setItem('visitorId', visitorId)
  }

  return visitorId
}

// ============================================
// TRACKING VISITEURS (Public)
// ============================================

// Enregistrer une visite de page
export const trackPageView = async (pageUrl, pageName) => {
  const visitorId = getVisitorId()

  try {
    const response = await fetch(`${API_URL}/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        pageUrl,
        pageName,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }),
    })

    if (!response.ok) throw new Error('Erreur tracking visite')
    return await response.json()
  } catch (error) {
    console.error('Erreur tracking visite:', error)
    return null
  }
}

// Enregistrer un événement (clic, scroll, etc.)
export const trackEvent = async (eventName, eventData) => {
  const visitorId = getVisitorId()

  try {
    const response = await axios.post(`${API_URL}/event`, {
      visitorId,
      eventName,
      eventData,
      timestamp: new Date().toISOString(),
    })
    return response.data
  } catch (error) {
    console.error('Erreur tracking événement:', error)
    return null
  }
}

// ============================================
// STATISTIQUES ADMIN (Protégées)
// ============================================

// Récupérer les visites sur une période
export const getVisitsByPeriod = async (startDate, endDate) => {
  const response = await axios.get(
    `${API_URL}/visits?start=${startDate}&end=${endDate}`,
    getConfig(),
  )
  return response.data
}

// Récupérer les statistiques mensuelles
export const getMonthlyStats = async (year, month) => {
  const response = await axios.get(
    `${API_URL}/monthly?year=${year}&month=${month}`,
    getConfig(),
  )
  return response.data
}

// Récupérer les statistiques du jour
export const getDailyStats = async () => {
  const response = await axios.get(`${API_URL}/daily`, getConfig())
  return response.data
}

// Récupérer le nombre de visiteurs uniques
export const getUniqueVisitors = async (period = 30) => {
  const response = await axios.get(
    `${API_URL}/unique-visitors?period=${period}`,
    getConfig(),
  )
  return response.data
}

// ============================================
// STATISTIQUES DÉTAILLÉES
// ============================================

// Pages les plus visitées
export const getTopPages = async (limit = 10) => {
  const response = await axios.get(
    `${API_URL}/top-pages?limit=${limit}`,
    getConfig(),
  )
  return response.data
}

// Produits les plus vus
export const getTopProducts = async (limit = 10) => {
  const response = await axios.get(
    `${API_URL}/top-products?limit=${limit}`,
    getConfig(),
  )
  return response.data
}

// Statistiques de conversion (visites -> commandes)
export const getConversionStats = async () => {
  const response = await axios.get(`${API_URL}/conversion`, getConfig())
  return response.data
}

// Sources de trafic
export const getTrafficSources = async () => {
  const response = await axios.get(`${API_URL}/traffic-sources`, getConfig())
  return response.data
}

// ============================================
// DASHBOARD ANALYTICS
// ============================================

/**
 * Récupère les statistiques du dashboard avec fallback automatique
 * Tente d'abord avec axios, puis avec fetch si axios échoue
 */
export const getDashboardStats = async () => {
  // Tente d'abord avec axios si disponible
  if (typeof axios !== 'undefined') {
    try {
      const response = await axios.get(`${API_URL}/dashboard`, getConfig())
      return response.data
    } catch (axiosError) {
      console.warn('Axios a échoué, tentative avec fetch:', axiosError.message)
      // Continue pour essayer avec fetch
    }
  }

  // Utilise fetch comme fallback
  try {
    const response = await fetch(`${API_URL}/dashboard`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    return await response.json()
  } catch (fetchError) {
    throw new Error(`Erreur chargement stats: ${fetchError.message}`)
  }
}

// Récupérer les données pour le graphique de visites trackVisite
export const getVisitsChartData = async (period = 30) => {
  const response = await axios.get(
    `${API_URL}/chart/visits?period=${period}`,
    getConfig(),
  )
  return response.data
}

// Récupérer les données pour le graphique de commandes
export const getOrdersChartData = async (period = 30) => {
  const response = await axios.get(
    `${API_URL}/chart/orders?period=${period}`,
    getConfig(),
  )
  return response.data
}

// ============================================
// EXPORT DONNÉES
// ============================================

// Exporter les statistiques en CSV
export const exportStatsToCSV = async (startDate, endDate) => {
  const response = await axios.get(`${API_URL}/export/csv`, {
    params: { start: startDate, end: endDate },
    ...getConfig(),
    responseType: 'blob',
  })
  return response.data
}

// ============================================
// UTILITAIRES
// ============================================

// Calculer le temps passé sur la page
let pageStartTime = Date.now()

export const getTimeOnPage = () => {
  return Math.floor((Date.now() - pageStartTime) / 1000) // en secondes
}

export const resetTimeOnPage = () => {
  pageStartTime = Date.now()
}

// Détecter le type d'appareil
export const getDeviceType = () => {
  const width = window.innerWidth

  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

// ============================================
// HOOKS AUTOMATIQUES (à utiliser dans App.jsx)
// ============================================

// Initialiser le tracking automatique
export const initAnalytics = () => {
  // Track page view au chargement
  trackPageView(window.location.pathname, document.title)

  // Track les changements de page (pour SPA)
  window.addEventListener('popstate', () => {
    trackPageView(window.location.pathname, document.title)
  })

  // Track le temps passé avant de quitter
  window.addEventListener('beforeunload', () => {
    const timeOnPage = getTimeOnPage()
    trackEvent('page_exit', {
      timeSpent: timeOnPage,
      page: window.location.pathname,
    })
  })
}

// Enregistrer une visite (public)
export const trackVisite = async () => {
  try {
    await axios.post(`${API_URL}/visite`)
  } catch (error) {
    console.error('Erreur track visite:', error)
  }
}
//enregistrer une commande public
export const trackCommande = async (
  produitId,
  produitNom,
  categorieId,
  categorieNom,
) => {
  try {
    await axios.post(`${API_URL}/commande`, {
      produitId,
      produitNom,
      categorieId,
      categorieNom,
    })
  } catch (error) {
    console.error('Erreur track commande:', error)
  }
}

// ============================================
// EXPORT PAR  trackCommande
// ============================================

export default {
  trackCommande,
  trackVisite,
  getVisitorId,
  trackPageView,
  trackEvent,
  getVisitsByPeriod,
  getMonthlyStats,
  getDailyStats,
  getUniqueVisitors,
  getTopPages,
  getTopProducts,
  getConversionStats,
  getTrafficSources,
  getDashboardStats,
  getVisitsChartData,
  getOrdersChartData,
  exportStatsToCSV,
  getTimeOnPage,
  resetTimeOnPage,
  getDeviceType,
  initAnalytics,
}
