import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts'
import * as categoryService from '../services/categoryService'
import * as analyticsService from '../services/analyticsService'
import * as reviewService from '../services/reviewService'
import AdminLayout from '../components/AdminLayout'
import './styles/Dashboard.css'

const PERIODS = [
  { value: 7, label: '7 jours' },
  { value: 30, label: '30 jours' },
  { value: 90, label: '90 jours' },
  { value: 365, label: '1 an' },
]

const HEATMAP_COLORS = {
  0: '#f0f0f0',
  1: '#cce5ff',
  2: '#99ccff',
  3: '#66b3ff',
  4: '#3399ff',
  5: '#0080ff',
  6: '#0066cc',
  7: '#004d99',
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalImages: 0,
    activeCategories: 0,
    recentCategories: [],
  })
  const [analyticsData, setAnalyticsData] = useState({
    chartData: [],
    stats: { totalVisites: 0, totalCommandes: 0, topProduit: { nom: 'Aucun', total: 0 }, topCategorie: { nom: 'Aucune', total: 0 } },
  })
  const [heuresData, setHeuresData] = useState([])
  const [alerts, setAlerts] = useState({ pendingReviews: 0, expiringPromotions: [] })
  const [collapsedPanel, setCollapsedPanel] = useState(null) // null | 'evolution' | 'heatmap'
  const [period, setPeriod] = useState(30)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    loadAllData()
  }, [period])

  const loadAllData = useCallback(async (isRefresh = false) => {
    const start = Date.now()
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    try {
      const [categoriesData, analytics, alertsData, heures] = await Promise.all([
        categoryService.getAllCategories().catch(() => ({ categories: [] })),
        analyticsService.getDashboardStats(period).catch(() => ({
          chartData: [],
          stats: { totalVisites: 0, totalCommandes: 0, topProduit: { nom: 'Aucun', total: 0 }, topCategorie: { nom: 'Aucune', total: 0 } },
        })),
        analyticsService.getDashboardAlerts().catch(() => ({ pendingReviews: 0, expiringPromotions: [] })),
        analyticsService.getVisitsByHour(period).catch(() => ({ heures: [] })),
      ])

      if (!mountedRef.current) return

      const categories = categoriesData.categories || []
      const totalImages = categories.reduce((sum, cat) => sum + (cat.nombreImages || 0), 0)
      const activeCategories = categories.filter((cat) => cat.actif).length

      setStats({
        totalCategories: categories.length,
        totalImages,
        activeCategories,
        recentCategories: categories.slice(0, 5),
      })
      setAnalyticsData(analytics)
      setAlerts(alertsData)
      setHeuresData(heures.heures || [])
    } catch (error) {
      console.error('Erreur chargement:', error)
      if (mountedRef.current) setError('Impossible de charger les données. Veuillez réessayer.')
    } finally {
      if (!mountedRef.current) return
      const elapsed = Date.now() - start
      setTimeout(() => {
        if (mountedRef.current) {
          setLoading(false)
          setRefreshing(false)
        }
      }, Math.max(0, 300 - elapsed))
    }
  }, [period])

  const handleRefresh = () => loadAllData(true)

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`
  }

  const calcTrend = () => {
    const data = analyticsData.chartData
    if (!data || data.length < 2) return null
    const half = Math.floor(data.length / 2)
    const firstHalf = data.slice(0, half)
    const secondHalf = data.slice(half)
    const avg = (arr, key) => arr.reduce((s, d) => s + (d[key] || 0), 0) / arr.length
    const trend = (first, second) => first === 0 ? 0 : Math.round(((second - first) / first) * 100)
    return {
      visites: trend(avg(firstHalf, 'visites'), avg(secondHalf, 'visites')),
      commandes: trend(avg(firstHalf, 'commandes'), avg(secondHalf, 'commandes')),
    }
  }

  const exportCSV = () => {
    const rows = analyticsData.chartData.map((d) => `${d.date},${d.visites},${d.commandes}`)
    const csv = 'Date,Visites,Rendez-Vous\n' + rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard_${period}j.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getHeatColor = (value, max) => {
    if (max === 0) return HEATMAP_COLORS[0]
    const ratio = value / max
    if (ratio === 0) return HEATMAP_COLORS[0]
    if (ratio <= 0.15) return HEATMAP_COLORS[1]
    if (ratio <= 0.3) return HEATMAP_COLORS[2]
    if (ratio <= 0.45) return HEATMAP_COLORS[3]
    if (ratio <= 0.6) return HEATMAP_COLORS[4]
    if (ratio <= 0.8) return HEATMAP_COLORS[5]
    return HEATMAP_COLORS[6]
  }

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

  const trend = calcTrend()
  const hasAlerts = alerts.pendingReviews > 0 || alerts.expiringPromotions.length > 0

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
          <h1>
            <ChartIcon />
            Dashboard
          </h1>
          <p>Vue d'ensemble RONY HAIR 237</p>
        </div>

        <div className='dashboard-toolbar'>
          <div className='period-selector'>
            {PERIODS.map((p) => (
              <button
                key={p.value}
                className={`period-btn ${period === p.value ? 'active' : ''}`}
                onClick={() => setPeriod(p.value)}
                disabled={loading || refreshing}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className='toolbar-actions'>
            <button className='btn-export' onClick={exportCSV} title='Exporter en CSV'>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4' /><polyline points='7 10 12 15 17 10' /><line x1='12' y1='15' x2='12' y2='3' /></svg>
              Exporter
            </button>
            <button
              className={`btn-refresh ${refreshing ? 'spinning' : ''}`}
              onClick={handleRefresh}
              disabled={refreshing}
              title='Actualiser'
            >
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><polyline points='23 4 23 10 17 10' /><path d='M20.49 15a9 9 0 11-2.12-9.36L23 10' /></svg>
            </button>
          </div>
        </div>

        {error && (
          <div className='error-banner'>
            <span>{error}</span>
            <button className='error-dismiss' onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {hasAlerts && (
          <div className='alerts-bar'>
            {alerts.pendingReviews > 0 && (
              <Link to='/admin/reviews' className='alert-item alert-review'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='12' cy='12' r='10' /><line x1='12' y1='8' x2='12' y2='12' /><line x1='12' y1='16' x2='12.01' y2='16' /></svg>
                {alerts.pendingReviews} avis en attente de modération
              </Link>
            )}
            {alerts.expiringPromotions.map((p) => (
              <Link key={p.id} to='/admin/promotions' className='alert-item alert-promo'>
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='12' cy='12' r='10' /><line x1='12' y1='8' x2='12' y2='12' /><line x1='12' y1='16' x2='12.01' y2='16' /></svg>
                Promo "{p.nom}" expire bientôt
              </Link>
            ))}
          </div>
        )}

        <div className='analytics-section'>
          <h2 className='section-title'>Statistiques ({period} derniers jours)</h2>

          <div className='stats-grid'>
            <div className='stat-card stat-card-info'>
              <StatCardIcon type='info'><EyeIcon /></StatCardIcon>
              <div className='stat-content'>
                <h3>Visites</h3>
                <p className='stat-value'>{analyticsData.stats.totalVisites}</p>
                <span className='stat-label'>Visiteurs uniques</span>
                <TrendBadge value={trend?.visites} />
              </div>
            </div>

            <div className='stat-card stat-card-success'>
              <StatCardIcon type='success'><ShoppingIcon /></StatCardIcon>
              <div className='stat-content'>
                <h3>Rendez-Vous</h3>
                <p className='stat-value'>{analyticsData.stats.totalCommandes}</p>
                <span className='stat-label'>Via WhatsApp</span>
                <TrendBadge value={trend?.commandes} />
              </div>
            </div>

            <div className='stat-card stat-card-warning'>
              <StatCardIcon type='warning'><StarIcon /></StatCardIcon>
              <div className='stat-content'>
                <h3>Top Produit</h3>
                <p className='stat-value'>{analyticsData.stats.topProduit.total}</p>
                <span className='stat-label'>{analyticsData.stats.topProduit.nom}</span>
              </div>
            </div>

            <div className='stat-card stat-card-primary'>
              <StatCardIcon type='primary'><TagIcon /></StatCardIcon>
              <div className='stat-content'>
                <h3>Top Service</h3>
                <p className='stat-value'>{analyticsData.stats.topCategorie.total}</p>
                <span className='stat-label'>{analyticsData.stats.topCategorie.nom}</span>
              </div>
            </div>
          </div>

          <div className={`charts-row ${collapsedPanel === 'evolution' ? 'charts-row-collapsed-evolution' : collapsedPanel === 'heatmap' ? 'charts-row-collapsed-heatmap' : ''}`}>
            <div className={`chart-card chart-card-evolution ${collapsedPanel === 'evolution' ? 'panel-collapsed' : ''}`}>
              <div className='panel-header'>
                <h3>Évolution</h3>
                <button className='panel-toggle' onClick={() => setCollapsedPanel(collapsedPanel === 'evolution' ? null : 'evolution')} title={collapsedPanel === 'evolution' ? 'Afficher' : 'Masquer'}>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' style={{ transform: collapsedPanel === 'heatmap' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                    <polyline points='15 18 9 12 15 6' />
                  </svg>
                </button>
              </div>
              {collapsedPanel !== 'evolution' && (
                <div className='chart-container'>
                  <ResponsiveContainer width='100%' height={300}>
                    <LineChart data={analyticsData.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' />
                      <XAxis dataKey='date' tickFormatter={formatDate} tick={{ fontSize: 11 }} stroke='#718096' />
                      <YAxis tick={{ fontSize: 11 }} stroke='#718096' />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType='line' />
                      <Line type='monotone' dataKey='visites' name='Visites' stroke='rgb(5, 84, 210)' strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                      <Line type='monotone' dataKey='commandes' name='Rendez-Vous' stroke='#00a416' strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className={`chart-card chart-card-heatmap ${collapsedPanel === 'heatmap' ? 'panel-collapsed' : ''}`}>
              <div className='panel-header'>
                <h3>Heures d'affluence</h3>
                <button className='panel-toggle' onClick={() => setCollapsedPanel(collapsedPanel === 'heatmap' ? null : 'heatmap')} title={collapsedPanel === 'heatmap' ? 'Afficher' : 'Masquer'}>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' style={{ transform: collapsedPanel === 'evolution' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                    <polyline points='15 18 9 12 15 6' />
                  </svg>
                </button>
              </div>
              {collapsedPanel !== 'heatmap' && (
                <div className='heatmap-container'>
                  {heuresData.length > 0 && (
                    <div className='heatmap-grid'>
                      {heuresData.map((h) => {
                        const max = Math.max(...heuresData.map((x) => x.visites), 1)
                        return (
                          <div key={h.heure} className='heatmap-cell' style={{ backgroundColor: getHeatColor(h.visites, max) }} title={`${h.heure}: ${h.visites} visites`}>
                            <span className='heatmap-value'>{h.visites}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {heuresData.length > 0 && (
                    <div className='heatmap-labels'>
                      {heuresData.filter((_, i) => i % 3 === 0).map((h) => (
                        <span key={h.heure} className='heatmap-label'>{h.heure}</span>
                      ))}
                    </div>
                  )}
                  {heuresData.length === 0 && (
                    <p className='heatmap-empty'>Pas encore assez de données</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='catalog-section'>
          <h2 className='section-title'>Votre Catalogue</h2>

          {stats.totalCategories === 0 ? (
            <DashboardEmpty />
          ) : (
            <>
              <div className='stats-grid'>
                <div className='stat-card stat-card-primary'>
                  <StatCardIcon type='primary'><FolderIcon /></StatCardIcon>
                  <div className='stat-content'>
                    <h3>Services</h3>
                    <p className='stat-value'>{stats.totalCategories}</p>
                    <span className='stat-label'>Total</span>
                  </div>
                </div>
                <div className='stat-card stat-card-success'>
                  <StatCardIcon type='success'><ImageIcon /></StatCardIcon>
                  <div className='stat-content'>
                    <h3>Produits</h3>
                    <p className='stat-value'>{stats.totalImages}</p>
                    <span className='stat-label'>Total</span>
                  </div>
                </div>
                <div className='stat-card stat-card-info'>
                  <StatCardIcon type='info'><ActiveIcon /></StatCardIcon>
                  <div className='stat-content'>
                    <h3>Actives</h3>
                    <p className='stat-value'>{stats.activeCategories}</p>
                    <span className='stat-label'>Visibles sur le site</span>
                  </div>
                </div>
                <div className='stat-card stat-card-warning'>
                  <StatCardIcon type='warning'><AvgIcon /></StatCardIcon>
                  <div className='stat-content'>
                    <h3>Produits/Service</h3>
                    <p className='stat-value'>{stats.totalCategories > 0 ? Math.round(stats.totalImages / stats.totalCategories) : 0}</p>
                    <span className='stat-label'>Moyenne par service</span>
                  </div>
                </div>
              </div>

              <div className='quick-actions'>
                <h3>Actions rapides</h3>
                <div className='actions-grid'>
                  <Link to='/admin/categories' className='action-card'>
                    <h4>Gérer les Services</h4>
                    <p>Ajouter, modifier, organiser</p>
                  </Link>
                  <Link to='/admin/promotions' className='action-card'>
                    <h4>Promotions</h4>
                    <p>Gérer les offres spéciales</p>
                  </Link>
                  <Link to='/admin/reviews' className='action-card'>
                    <h4>Avis Clients</h4>
                    <p>Modérer les témoignages</p>
                  </Link>
                  <Link to='/accueil' target='_blank' className='action-card'>
                    <h4>Voir le Site</h4>
                    <p>Aperçu public</p>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

const StatCardIcon = ({ type, children }) => (
  <div className={`stat-icon stat-icon-${type}`}>{children}</div>
)

const TrendBadge = ({ value }) => {
  if (value === null || value === 0) return null
  const isUp = value > 0
  return (
    <span className={`trend-badge ${isUp ? 'trend-up' : 'trend-down'}`}>
      {isUp ? '▲' : '▼'} {Math.abs(value)}%
    </span>
  )
}

const DashboardEmpty = () => (
  <div className='empty-state'>
    <div className='empty-icon'>
      <svg width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='#a0aec0' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
        <path d='M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z' />
        <polyline points='13 2 13 9 20 9' />
      </svg>
    </div>
    <h3>Bienvenue sur votre espace d'administration</h3>
    <p>Commencez par créer votre premier service pour voir apparaître les statistiques ici.</p>
    <Link to='/admin/categories/new' className='empty-cta'>Créer un service</Link>
  </div>
)

const ChartIcon = () => (<svg width='28' height='28' viewBox='0 0 24 24' fill='#d81a88'><path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' /></svg>)
const EyeIcon = () => (<svg width='32' height='32' viewBox='0 0 24 24' fill='#3B82F6'><path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' /></svg>)
const ShoppingIcon = () => (<svg width='32' height='32' viewBox='0 0 24 24' fill='#10B981'><path d='M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z' /></svg>)
const StarIcon = () => (<svg width='32' height='32' viewBox='0 0 24 24' fill='#F59E0B'><path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' /></svg>)
const TagIcon = () => (<svg width='32' height='32' viewBox='0 0 24 24' fill='#4F46E5'><path d='M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z' /></svg>)
const FolderIcon = () => (<svg width='32' height='32' viewBox='0 0 24 24' fill='#4F46E5'><path d='M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z' /></svg>)
const ImageIcon = () => (<svg width='32' height='32' viewBox='0 0 24 24' fill='#10B981'><path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' /></svg>)
const ActiveIcon = () => (<svg width='32' height='32' viewBox='0 0 24 24' fill='#3B82F6'><path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' /></svg>)
const AvgIcon = () => (<svg width='32' height='32' viewBox='0 0 24 24' fill='#F59E0B'><path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z' /></svg>)

export default Dashboard
