import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import * as categoryService from '../services/categoryService'
import * as analyticsService from '../services/analyticsService'
import AdminLayout from '../components/AdminLayout'
import './styles/Dashboard.css'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalImages: 0,
    activeCategories: 0,
    recentCategories: [],
  })

  const [analyticsData, setAnalyticsData] = useState({
    chartData: [],
    stats: {
      totalVisites: 0,
      totalCommandes: 0,
      topProduit: { nom: 'Aucun', total: 0 },
      topCategorie: { nom: 'Aucune', total: 0 },
    },
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)

      // Charger stats catégories
      const categoriesData = await categoryService.getAllCategories()
      const categories = categoriesData.categories || []

      const totalImages = categories.reduce(
        (sum, cat) => sum + (cat.nombreImages || 0),
        0,
      )
      const activeCategories = categories.filter((cat) => cat.actif).length

      setStats({
        totalCategories: categories.length,
        totalImages,
        activeCategories,
        recentCategories: categories.slice(0, 5),
      })

      // Charger analytics
      const analytics = await analyticsService.getDashboardStats()
      setAnalyticsData(analytics)
    } catch (error) {
      console.error('Erreur chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  // Formater les dates pour affichage mobile
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    return `${day}/${month}`
  }

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className='custom-tooltip'>
          <p className='tooltip-date'>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: <strong>{entry.value}</strong>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Icônes
  const ChartIcon = () => (
    <svg width='28' height='28' viewBox='0 0 24 24' fill='#4F46E5'>
      <path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' />
    </svg>
  )

  const EyeIcon = () => (
    <svg width='32' height='32' viewBox='0 0 24 24' fill='#3B82F6'>
      <path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' />
    </svg>
  )

  const ShoppingIcon = () => (
    <svg width='32' height='32' viewBox='0 0 24 24' fill='#10B981'>
      <path d='M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z' />
    </svg>
  )

  const TrophyIcon = () => (
    <svg width='32' height='32' viewBox='0 0 24 24' fill='#F59E0B'>
      <path d='M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z' />
    </svg>
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className='loading-container'>
          <div className='spinner'></div>
          <p>Chargement...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className='dashboard'>
        <div className='dashboard-header'>
          <h1 style={{ display: 'flex', alignItems: 'center' }}>
            <ChartIcon />
            Dashboard
          </h1>
          <p>Vue d'ensemble RONY HAIR 237</p>
        </div>

        {/* Stats Analytics - 30 derniers jours */}
        <div className='analytics-section'>
          <h2 className='section-title'>Statistiques (30 derniers jours)</h2>
          <p
            className='section-title'
            style={{ fontSize: '14px', color: '#718096' }}
          >
            NB : Si vous êtes sur mobile, mettez votre appareil en paysage pour
            mieux lire la courbe!!
          </p>

          <div className='stats-grid'>
            <div className='stat-card stat-card-info'>
              <div className='stat-icon'>
                <EyeIcon />
              </div>
              <div className='stat-content'>
                <h3>Visites</h3>
                <p className='stat-value'>{analyticsData.stats.totalVisites}</p>
                <span className='stat-label'>Visiteurs uniques</span>
              </div>
            </div>

            <div className='stat-card stat-card-success'>
              <div className='stat-icon'>
                <ShoppingIcon />
              </div>
              <div className='stat-content'>
                <h3>Rndez-Vous</h3>
                <p className='stat-value'>
                  {analyticsData.stats.totalCommandes}
                </p>
                <span className='stat-label'>Via WhatsApp</span>
              </div>
            </div>

            <div className='stat-card stat-card-warning'>
              <div className='stat-icon'>
                <TrophyIcon />
              </div>
              <div className='stat-content'>
                <h3>Top Produit</h3>
                <p className='stat-value'>
                  {analyticsData.stats.topProduit.total}
                </p>
                <span className='stat-label'>
                  {analyticsData.stats.topProduit.nom}
                </span>
              </div>
            </div>

            <div className='stat-card stat-card-primary'>
              <div className='stat-icon'>
                <TrophyIcon />
              </div>
              <div className='stat-content'>
                <h3>Top Services</h3>
                <p className='stat-value'>
                  {analyticsData.stats.topCategorie.total}
                </p>
                <span className='stat-label'>
                  {analyticsData.stats.topCategorie.nom}
                </span>
              </div>
            </div>
          </div>

          {/* Graphique 3 courbes */}
          <div className='chart-card chart-card-large'>
            <h3>Évolution sur 30 jours</h3>
            <div className='chart-container'>
              <ResponsiveContainer width='100%' height={350}>
                <LineChart
                  data={analyticsData.chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' />
                  <XAxis
                    dataKey='date'
                    tickFormatter={formatDate}
                    tick={{ fontSize: 11 }}
                    stroke='#718096'
                  />
                  <YAxis tick={{ fontSize: 11 }} stroke='#718096' />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    iconType='line'
                  />
                  <Line
                    type='monotone'
                    dataKey='visites'
                    name='Visites sur le site'
                    stroke='rgb(5, 84, 210)'
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='commandes'
                    name='Commandes'
                    stroke='#00a416'
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stats Catalogue */}
        <div className='catalog-section'>
          <h2 className='section-title'>Votre Catalogue</h2>
          <div className='stats-grid'>
            <div className='stat-card stat-card-primary'>
              <div className='stat-content'>
                <h3>Services</h3>
                <p className='stat-value'>{stats.totalCategories}</p>
                <span className='stat-label'>Total</span>
              </div>
            </div>

            <div className='stat-card stat-card-success'>
              <div className='stat-content'>
                <h3>Produits</h3>
                <p className='stat-value'>{stats.totalImages}</p>
                <span className='stat-label'>Total</span>
              </div>
            </div>

            <div className='stat-card stat-card-info'>
              <div className='stat-content'>
                <h3>Actives</h3>
                <p className='stat-value'>{stats.activeCategories}</p>
                <span className='stat-label'>Visibles</span>
              </div>
            </div>

            <div className='stat-card stat-card-warning'>
              <div className='stat-content'>
                <h3>Moyenne</h3>
                <p className='stat-value'>
                  {stats.totalCategories > 0
                    ? Math.round(stats.totalImages / stats.totalCategories)
                    : 0}
                </p>
                <span className='stat-label'>Produits/services</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className='quick-actions'>
          <h3>Actions rapides</h3>
          <div className='actions-grid'>
            <Link to='/admin/categories' className='action-card'>
              <h4>Gérer les Services</h4>
              <p>Ajouter/Modifier</p>
            </Link>

            <Link to='/' target='_blank' className='action-card'>
              <h4>Voir le Site</h4>
              <p>Aperçu public</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard
