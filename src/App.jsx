import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import * as authService from './services/authService'
import LoadingPage from './components/LoadingPage'

const LandingPage = React.lazy(() => import('./components/LandingPage'))
const HomePage = React.lazy(() => import('./components/HomePage'))
const OrderPage = React.lazy(() => import('./components/OrderPage'))
const AdminLogin = React.lazy(() => import('./components/AdminLogin'))
const Dashboard = React.lazy(() => import('./components/Dashboard'))
const CategoriesList = React.lazy(() => import('./components/CategoriesList'))
const PublicCategoriesList = React.lazy(() => import('./components/PublicCategoriesList'))
const PublicPromotions = React.lazy(() => import('./components/PublicPromotions'))
const CreateCategory = React.lazy(() => import('./components/CreateCategory'))
const ManageImages = React.lazy(() => import('./components/ManageImages'))
const ManagePromotions = React.lazy(() => import('./components/ManagePromotions'))
const AdminReviews = React.lazy(() => import('./components/AdminReviews'))
const ManageAdmins = React.lazy(() => import('./components/ManageAdmins'))
const Contact = React.lazy(() => import('./components/infos/Contact'))
const Conditions = React.lazy(() => import('./components/infos/Conditions'))
const Confidentialite = React.lazy(() => import('./components/infos/Confidentialite'))
const FAQ = React.lazy(() => import('./components/infos/FAQ'))
const CategoryProducts = React.lazy(() => import('./components/CategoryProducts'))

const AUTH_CACHE_KEY = 'auth_cache'
const AUTH_CACHE_TTL = 5 * 60 * 1000

const getCachedAuth = () => {
  try {
    const cached = sessionStorage.getItem(AUTH_CACHE_KEY)
    if (!cached) return null
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > AUTH_CACHE_TTL) {
      sessionStorage.removeItem(AUTH_CACHE_KEY)
      return null
    }
    return data
  } catch { return null }
}

const setCachedAuth = (data) => {
  try {
    sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
  } catch { }
}

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(!getCachedAuth())
  const [isAuthenticated, setIsAuthenticated] = useState(!!getCachedAuth())
  const checkRef = useRef(false)

  useEffect(() => {
    if (checkRef.current) return
    checkRef.current = true
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const cached = getCachedAuth()
    if (cached) {
      setIsAuthenticated(cached.success)
      setIsChecking(false)
      return
    }
    try {
      const data = await authService.checkAuthStatus()
      setCachedAuth(data)
      setIsAuthenticated(data.success)
    } catch {
      setIsAuthenticated(false)
    } finally {
      setIsChecking(false)
    }
  }

  if (isChecking) {
    return <LoadingPage />
  }

  return isAuthenticated ? children : <Navigate to='/admin/login' replace />
}

const PageLoader = () => (
  <div className='loading-container' style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className='spinner'></div>
    <p style={{ marginTop: '16px', color: '#666' }}>Chargement...</p>
  </div>
)

function App() {
  const preserveScroll = useCallback(() => {
    const scrollY = window.scrollY
    setTimeout(() => window.scrollTo(0, scrollY), 0)
  }, [])

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/accueil' element={<HomePage />} />
          <Route path='/order' element={<OrderPage />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/conditions' element={<Conditions />} />
          <Route path='/confidentialite' element={<Confidentialite />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/categories' element={<PublicCategoriesList />} />
          <Route path='/promotions' element={<PublicPromotions />} />
          <Route path='/category/:slug' element={<CategoryProducts />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='/admin/categories' element={<ProtectedRoute><CategoriesList /></ProtectedRoute>} />
          <Route path='/admin/categories/new' element={<ProtectedRoute><CreateCategory /></ProtectedRoute>} />
          <Route path='/admin/categories/:categoryId/images' element={<ProtectedRoute><ManageImages /></ProtectedRoute>} />
          <Route path='/admin/promotions' element={<ProtectedRoute><ManagePromotions /></ProtectedRoute>} />
          <Route path='/admin/reviews' element={<ProtectedRoute><AdminReviews /></ProtectedRoute>} />
          <Route path='/admin/admins' element={<ProtectedRoute><ManageAdmins /></ProtectedRoute>} />
          <Route path='/admin' element={<Navigate to='/admin/dashboard' replace />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
