// ============================================
// reducers/categorySlice.js
// Gestion des catégories (utilise categoryService)
// ============================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as categoryService from '../services/categoryService'

// ============================================
// THUNKS ASYNCHRONES
// ============================================

// Récupérer toutes les catégories (admin)
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await categoryService.getAllCategories()
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur de chargement')
    }
  },
)

// Récupérer une catégorie par ID
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await categoryService.getCategoryById(id)
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Catégorie introuvable')
    }
  },
)

// Créer une catégorie
export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, { rejectWithValue }) => {
    try {
      const data = await categoryService.createCategory(categoryData)
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur de création')
    }
  },
)

// Modifier une catégorie
export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await categoryService.updateCategory(id, data)
      return result
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur de modification')
    }
  },
)

// Supprimer une catégorie
export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      const data = await categoryService.deleteCategory(id)
      return { id, ...data }
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur de suppression')
    }
  },
)

// ============================================
// SLICE
// ============================================

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    currentCategory: null, // Catégorie en cours de visualisation/édition
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null
      state.success = null
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null
    },
  },
  extraReducers: (builder) => {
    // ========== FETCH ALL ==========
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.categories || []
        state.error = null
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ========== FETCH BY ID ==========
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false
        state.currentCategory = action.payload.category
        state.error = null
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ========== CREATE ==========
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload.category)
        state.success = action.payload.message
        state.error = null
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = null
      })

    // ========== UPDATE ==========
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex(
          (cat) => cat._id === action.payload.category._id,
        )
        if (index !== -1) {
          state.items[index] = action.payload.category
        }
        state.currentCategory = action.payload.category
        state.success = action.payload.message
        state.error = null
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = null
      })

    // ========== DELETE ==========
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((cat) => cat._id !== action.payload.id)
        state.success = action.payload.message
        state.error = null
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = null
      })
  },
})

export const { clearMessages, setCurrentCategory, clearCurrentCategory } =
  categorySlice.actions

export default categorySlice.reducer
