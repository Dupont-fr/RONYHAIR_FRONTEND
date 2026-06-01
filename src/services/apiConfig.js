const isProd = process.env.NODE_ENV === 'production'
const PROD_URL = 'https://rony-hair-237.onrender.com'

export const API = {
  admin: `${isProd ? PROD_URL : ''}/api/admin`,
  adminCategories: `${isProd ? PROD_URL : ''}/api/admin/categories`,
  adminPromotions: `${isProd ? PROD_URL : ''}/api/admin/promotions`,
  adminAnalytics: `${isProd ? PROD_URL : ''}/api/admin/analytics`,
  adminOrders: `${isProd ? PROD_URL : ''}/api/admin/orders`,
  adminProducts: `${isProd ? PROD_URL : ''}/api/admin/products`,
  categories: `${isProd ? PROD_URL : ''}/api/categories`,
  promotions: `${isProd ? PROD_URL : ''}/api/promotions`,
  reviews: `${isProd ? PROD_URL : ''}/api/reviews`,
  orders: `${isProd ? PROD_URL : ''}/api/orders`,
  contact: `${isProd ? PROD_URL : ''}/api/contact`,
  upload: `${isProd ? PROD_URL : ''}/api/upload`,
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
