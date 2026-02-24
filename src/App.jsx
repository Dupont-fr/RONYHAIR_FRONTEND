import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import * as authService from './services/authService'

// Import du composant de page de chargement
import LoadingPage from './components/LoadingPage'

import HomePage from './components/HomePage'
import OrderPage from './components/OrderPage'
import AdminLogin from './components/AdminLogin'
import Dashboard from './components/Dashboard'
import CategoriesList from './components/CategoriesList' // ADMIN
import PublicCategoriesList from './components/PublicCategoriesList' // PUBLIC
import CreateCategory from './components/CreateCategory'
import ManageImages from './components/ManageImages'
import ManagePromotions from './components/ManagePromotions'
import Contact from './components/infos/Contact'
import Conditions from './components/infos/Conditions'
import Confidentialite from './components/infos/Confidentialite'
import FAQ from './components/infos/FAQ'
import CategoryProducts from './components/CategoryProducts'

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const data = await authService.checkAuthStatus()
      setIsAuthenticated(data.success)
    } catch (error) {
      console.error('Non authentifié:', error)
      setIsAuthenticated(false)
    } finally {
      setIsChecking(false)
    }
  }

  // On remplace l'ancien loader par le nouveau composant LoadingPage
  if (isChecking) {
    return <LoadingPage onLoadingComplete={() => setIsChecking(false)} />
  }

  return isAuthenticated ? children : <Navigate to='/admin/login' replace />
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  // MODIFICATION : Ajout d'un état pour gérer le chargement initial de l'application
  useEffect(() => {
    // Simuler un temps de chargement initial pour améliorer l'expérience utilisateur
    // Cette logique peut être étendue pour charger des données globales si nécessaire
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3500) // Durée de 3.5 secondes pour la page de chargement initiale

    return () => clearTimeout(timer)
  }, [])

  // MODIFICATION : Afficher la page de chargement uniquement au démarrage de l'app
  if (isLoading) {
    return <LoadingPage onLoadingComplete={() => setIsLoading(false)} />
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== ROUTES PUBLIQUES ==================== */}
        <Route path='/' element={<HomePage />} />
        <Route path='/order' element={<OrderPage />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/conditions' element={<Conditions />} />
        <Route path='/confidentialite' element={<Confidentialite />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/categories' element={<PublicCategoriesList />} />
        <Route path='/category/:slug' element={<CategoryProducts />} />

        {/* ==================== ROUTES ADMIN ==================== */}
        <Route path='/admin/login' element={<AdminLogin />} />

        <Route
          path='/admin/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path='/admin/categories'
          element={
            <ProtectedRoute>
              <CategoriesList />
            </ProtectedRoute>
          }
        />

        <Route
          path='/admin/categories/new'
          element={
            <ProtectedRoute>
              <CreateCategory />
            </ProtectedRoute>
          }
        />

        <Route
          path='/admin/categories/:categoryId/images'
          element={
            <ProtectedRoute>
              <ManageImages />
            </ProtectedRoute>
          }
        />

        <Route
          path='/admin/promotions'
          element={
            <ProtectedRoute>
              <ManagePromotions />
            </ProtectedRoute>
          }
        />

        <Route
          path='/admin'
          element={<Navigate to='/admin/dashboard' replace />}
        />

        {/* ==================== ROUTE 404 ==================== */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
