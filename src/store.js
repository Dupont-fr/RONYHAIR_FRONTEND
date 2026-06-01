import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authSlice'
import categoryReducer from './reducers/categorySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export default store
