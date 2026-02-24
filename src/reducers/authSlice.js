// ============================================
// reducers/authSlice.js
// Gestion de l'authentification (utilise authService)
// ============================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as authService from '../services/authService'

// ============================================
// THUNKS ASYNCHRONES
// ============================================

// Login admin
export const loginAdmin = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.loginAdmin(credentials)
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur de connexion')
    }
  },
)

// Logout admin
export const logoutAdmin = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.logoutAdmin()
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur de déconnexion')
    }
  },
)

// Vérifier la session admin
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.checkAuthStatus()
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Session expirée')
    }
  },
)

// ============================================
// SLICE
// ============================================

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    admin: authService.getAdminFromStorage(), // Charger depuis localStorage
    isAuthenticated: !!authService.getAdminFromStorage(),
    loading: false,
    error: null,
    checkingAuth: true, // Pour vérifier au chargement initial
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetAuth: (state) => {
      state.admin = null
      state.isAuthenticated = false
      state.error = null
      authService.removeAdminFromStorage()
    },
  },
  extraReducers: (builder) => {
    // ========== LOGIN ==========
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.admin = action.payload.admin
        state.error = null
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.admin = null
        state.error = action.payload
      })

    // ========== LOGOUT ==========
    builder
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.admin = null
        state.error = null
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        // Même en cas d'erreur, déconnecter localement
        state.isAuthenticated = false
        state.admin = null
      })

    // ========== CHECK AUTH STATUS ==========
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.checkingAuth = true
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.checkingAuth = false
        state.isAuthenticated = true
        state.admin = action.payload.admin
        state.error = null
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.checkingAuth = false
        state.isAuthenticated = false
        state.admin = null
      })
  },
})

export const { clearError, resetAuth } = authSlice.actions
export default authSlice.reducer
