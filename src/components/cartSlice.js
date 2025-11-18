import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    totalItems: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload
      const existingItem = state.items.find(item => item.id === newItem.id)
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1
      } else {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1
        })
      }
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload
      state.items = state.items.filter(item => item.id !== itemId)
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload
      const item = state.items.find(item => item.id === itemId)
      
      if (item) {
        if (quantity < 1) {
          state.items = state.items.filter(item => item.id !== itemId)
        } else {
          item.quantity = quantity
        }
      }
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    clearCart: (state) => {
      state.items = []
      state.totalAmount = 0
      state.totalItems = 0
    },
  },
})

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart
} = cartSlice.actions

export default cartSlice.reducer