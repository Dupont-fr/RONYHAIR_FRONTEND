import axios from 'axios'
import { getToken } from './authService'

// const API_URL = '/api/orders'

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://gaetan-bois.onrender.com/api/orders'
    : '/api/orders'

// const adminApiUrl = '/api/admin/orders'

const adminApiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://gaetan-bois.onrender.com/api/admin/orders'
    : '/api/admin/orders'

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
// ROUTES PUBLIQUES (Visiteurs)
// ============================================

// Créer une commande (visiteur)
export const createOrder = async (orderData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) throw new Error('Erreur lors de la création de la commande')
  return await response.json()
}

// Récupérer une commande par ID de tracking
export const getOrderByTracking = async (trackingId) => {
  const response = await fetch(`${API_URL}/track/${trackingId}`)
  if (!response.ok) throw new Error('Commande introuvable')
  return await response.json()
}

// ============================================
// ROUTES ADMIN (Protégées)
// ============================================

// Récupérer toutes les commandes (Admin)
export const getAllOrders = async () => {
  const res = await fetch(adminApiUrl, { headers: getAuthHeaders() })
  if (!res.ok) throw new Error('Erreur de chargement des commandes')
  return await res.json()
}

// Récupérer une commande par ID (Admin)
export const getOrderById = async (id) => {
  const response = await fetch(`${adminApiUrl}/${id}`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Commande introuvable')
  return await response.json()
}

// Mettre à jour le statut d'une commande (Admin)
export const updateOrderStatus = async (id, status, note) => {
  const response = await axios.put(
    `${adminApiUrl}/${id}/status`,
    { status, note },
    getConfig(),
  )
  return response.data
}

// Supprimer une commande (Admin)
export const deleteOrder = async (id) => {
  const res = await fetch(`${adminApiUrl}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error('Erreur suppression commande')
  return true
}

// Marquer une commande comme payée (Admin)
export const markOrderAsPaid = async (id, paymentDetails) => {
  const response = await axios.put(
    `${adminApiUrl}/${id}/payment`,
    paymentDetails,
    getConfig(),
  )
  return response.data
}

// ============================================
// FILTRES ET RECHERCHE
// ============================================

// Filtrer les commandes par statut
export const getOrdersByStatus = async (status) => {
  const response = await axios.get(
    `${adminApiUrl}?status=${status}`,
    getConfig(),
  )
  return response.data
}

// Rechercher des commandes
export const searchOrders = async (query) => {
  const response = await axios.get(
    `${adminApiUrl}/search?q=${encodeURIComponent(query)}`,
    getConfig(),
  )
  return response.data
}

// Filtrer les commandes par date
export const getOrdersByDateRange = async (startDate, endDate) => {
  const response = await axios.get(
    `${adminApiUrl}?start=${startDate}&end=${endDate}`,
    getConfig(),
  )
  return response.data
}

// ============================================
// STATISTIQUES
// ============================================

// Récupérer les statistiques des commandes
export const getOrderStats = async () => {
  const response = await axios.get(`${adminApiUrl}/stats`, getConfig())
  return response.data
}

// Récupérer les commandes récentes
export const getRecentOrders = async (limit = 10) => {
  const response = await axios.get(
    `${adminApiUrl}/recent?limit=${limit}`,
    getConfig(),
  )
  return response.data
}

// Récupérer les commandes en attente
export const getPendingOrders = async () => {
  const response = await axios.get(
    `${adminApiUrl}?status=en_attente`,
    getConfig(),
  )
  return response.data
}

// ============================================
// NOTIFICATIONS
// ============================================

// Envoyer une notification WhatsApp au client
export const sendOrderNotification = async (orderId, message) => {
  const response = await axios.post(
    `${adminApiUrl}/${orderId}/notify`,
    { message },
    getConfig(),
  )
  return response.data
}

// ============================================
// EXPORT / RAPPORTS
// ============================================

// Exporter les commandes en CSV
export const exportOrdersToCSV = async (filters) => {
  const response = await axios.get(`${adminApiUrl}/export/csv`, {
    params: filters,
    ...getConfig(),
    responseType: 'blob',
  })
  return response.data
}

// Générer un rapport de commandes
export const generateOrderReport = async (period) => {
  const response = await axios.get(
    `${adminApiUrl}/report?period=${period}`,
    getConfig(),
  )
  return response.data
}

// ============================================
// UTILITAIRES
// ============================================

// Calculer le total d'une commande
export const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.prix * item.quantite
  }, 0)
}

// Générer un ID de tracking unique
export const generateTrackingId = () => {
  return `CMD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
}

// ============================================
// EXPORT PAR DÉFAUT
// ============================================

export default {
  createOrder,
  getOrderByTracking,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  markOrderAsPaid,
  getOrdersByStatus,
  searchOrders,
  getOrdersByDateRange,
  getOrderStats,
  getRecentOrders,
  getPendingOrders,
  sendOrderNotification,
  exportOrdersToCSV,
  generateOrderReport,
  calculateOrderTotal,
  generateTrackingId,
}
