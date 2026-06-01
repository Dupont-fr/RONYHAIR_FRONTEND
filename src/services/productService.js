import axios from 'axios'
import { API, getAuthHeaders } from './apiConfig'

export const getAllProducts = async () => {
  const res = await fetch(API.adminProducts, { headers: getAuthHeaders() })
  if (!res.ok) throw new Error('Erreur de chargement des produits')
  return await res.json()
}

export default { getAllProducts }
