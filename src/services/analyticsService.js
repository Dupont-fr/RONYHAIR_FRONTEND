import axios from 'axios'
import { API, getAuthHeaders } from './apiConfig'

const generateVisitorId = () => `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

export const getVisitorId = () => {
  let visitorId = localStorage.getItem('visitorId')
  if (!visitorId) {
    visitorId = generateVisitorId()
    localStorage.setItem('visitorId', visitorId)
  }
  return visitorId
}

export const trackVisite = async () => {
  try { await axios.post(`${API.adminAnalytics}/visite`) }
  catch {}
}

export const trackCommande = async (produitId, produitNom, categorieId, categorieNom) => {
  try {
    await axios.post(`${API.adminAnalytics}/commande`, { produitId, produitNom, categorieId, categorieNom })
  } catch {}
}

export const getDashboardStats = async (days = 30) => {
  try {
    const response = await axios.get(`${API.adminAnalytics}/dashboard?days=${days}`, { headers: getAuthHeaders() })
    return response.data
  } catch (axiosError) {
    try {
      const response = await fetch(`${API.adminAnalytics}/dashboard?days=${days}`, { headers: getAuthHeaders() })
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`)
      return await response.json()
    } catch (fetchError) {
      throw new Error(`Erreur chargement stats: ${fetchError.message}`)
    }
  }
}

export const getDashboardAlerts = async () => {
  const response = await axios.get(`${API.adminAnalytics}/alerts`, { headers: getAuthHeaders() })
  return response.data
}

export const getVisitsByHour = async (days = 30) => {
  const response = await axios.get(`${API.adminAnalytics}/heures?days=${days}`, { headers: getAuthHeaders() })
  return response.data
}

export default { trackVisite, trackCommande, getVisitorId, getDashboardStats, getDashboardAlerts, getVisitsByHour }
