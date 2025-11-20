import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'

const CART_STORAGE_KEY = 'freshcart_cart'

const loadCartState = () => {
  if (typeof window === 'undefined') return undefined
  try {
    const serialized = localStorage.getItem(CART_STORAGE_KEY)
    if (!serialized) return undefined
    const cartState = JSON.parse(serialized)
    return { cart: cartState }
  } catch (e) {
    console.error('Failed to load cart from localStorage', e)
    return undefined
  }
}

const saveCartState = (cartState) => {
  if (typeof window === 'undefined') return
  try {
    const serialized = JSON.stringify(cartState)
    localStorage.setItem(CART_STORAGE_KEY, serialized)
  } catch (e) {
    console.error('Failed to save cart to localStorage', e)
  }
}

const preloadedState = loadCartState()

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState,
})

store.subscribe(() => {
  const state = store.getState()
  saveCartState(state.cart)
})

export default store
