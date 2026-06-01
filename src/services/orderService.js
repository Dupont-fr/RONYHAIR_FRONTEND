import axios from 'axios'
import { API, getAuthHeaders } from './apiConfig'

export const getAllOrders = async () => {
  const res = await fetch(API.adminOrders, { headers: getAuthHeaders() })
  if (!res.ok) throw new Error('Erreur de chargement des commandes')
  return await res.json()
}

export default { getAllOrders }
