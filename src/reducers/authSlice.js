import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as authService from '../services/authService'

export const loginAdmin = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.loginAdmin(credentials)
    return data
  } catch (error) {
    return rejectWithValue(error.message || 'Erreur de connexion')
  }
})

export const logoutAdmin = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const data = await authService.logoutAdmin()
    return data
  } catch (error) {
    return rejectWithValue(error.message || 'Erreur de déconnexion')
  }
})

export const checkAuthStatus = createAsyncThunk('auth/checkStatus', async (_, { rejectWithValue }) => {
  try {
    const data = await authService.checkAuthStatus()
    return data
  } catch (error) {
    return rejectWithValue(error.message || 'Session expirée')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    admin: authService.getAdminFromStorage(),
    isAuthenticated: !!authService.getAdminFromStorage(),
    loading: false,
    error: null,
    checkingAuth: true,
  },
  reducers: {
    clearError: (state) => { state.error = null },
    resetAuth: (state) => {
      state.admin = null; state.isAuthenticated = false; state.error = null
      authService.removeAdminFromStorage()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loginAdmin.fulfilled, (state, action) => { state.loading = false; state.isAuthenticated = true; state.admin = action.payload.admin; state.error = null })
      .addCase(loginAdmin.rejected, (state, action) => { state.loading = false; state.isAuthenticated = false; state.admin = null; state.error = action.payload })
      .addCase(logoutAdmin.pending, (state) => { state.loading = true })
      .addCase(logoutAdmin.fulfilled, (state) => { state.loading = false; state.isAuthenticated = false; state.admin = null; state.error = null })
      .addCase(logoutAdmin.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.isAuthenticated = false; state.admin = null })
      .addCase(checkAuthStatus.pending, (state) => { state.checkingAuth = true })
      .addCase(checkAuthStatus.fulfilled, (state, action) => { state.checkingAuth = false; state.isAuthenticated = true; state.admin = action.payload.admin; state.error = null })
      .addCase(checkAuthStatus.rejected, (state) => { state.checkingAuth = false; state.isAuthenticated = false; state.admin = null })
  },
})

export const { clearError, resetAuth } = authSlice.actions
export default authSlice.reducer
