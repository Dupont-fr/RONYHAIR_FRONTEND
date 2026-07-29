export const API = {
  admin: '/api/admin',
  adminCategories: '/api/admin/categories',
  adminPromotions: '/api/admin/promotions',
  adminAnalytics: '/api/admin/analytics',
  adminOrders: '/api/admin/orders',
  adminProducts: '/api/admin/products',
  categories: '/api/categories',
  promotions: '/api/promotions',
  reviews: '/api/reviews',
  orders: '/api/orders',
  contact: '/api/contact',
  upload: '/api/upload',
}

export const WHATSAPP_NUMBERS = {
  MAIN: '237696409306',
  SECONDARY: '237656173692',
}

export const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary')) return url
  const { width = 400, height, quality = 'auto', fetchFormat = 'auto' } = options
  const parts = url.split('/upload/')
  if (parts.length < 2) return url
  const transformations = [`f_${fetchFormat}`, `q_${quality}`, `w_${width}`]
  if (height) transformations.push(`h_${height}`, 'c_fill')
  return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`
}
