"use client"

import { useState, useEffect } from "react"

export interface CartItem {
  id: number
  name: string
  brand: string
  price: number
  promoPrice?: number
  quantity: number
  image: string
}

const CART_STORAGE_KEY = "shopping_cart"

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load cart from localStorage
  const loadCartFromStorage = () => {
    try {
      setIsLoading(true)
      setError(null)

      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart)
        // Validate the cart data structure
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart)
        } else {
          // If invalid data, initialize with empty cart
          setCart([])
          localStorage.removeItem(CART_STORAGE_KEY)
        }
      } else {
        // Initialize with some sample data if cart is empty
        const sampleCart: CartItem[] = [
          {
            id: 1,
            name: "Premium Wireless Headphones",
            brand: "AudioTech",
            price: 299.99,
            promoPrice: 249.99,
            quantity: 2,
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: 2,
            name: "Smart Fitness Watch",
            brand: "FitPro",
            price: 199.99,
            quantity: 1,
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: 3,
            name: "Bluetooth Speaker",
            brand: "SoundWave",
            price: 89.99,
            promoPrice: 69.99,
            quantity: 1,
            image: "/placeholder.svg?height=100&width=100",
          },
        ]
        setCart(sampleCart)
        saveCartToStorage(sampleCart)
      }
    } catch (err) {
      setError("Failed to load cart from storage")
      console.error("Error loading cart:", err)
      setCart([])
    } finally {
      setIsLoading(false)
    }
  }

  // Save cart to localStorage
  const saveCartToStorage = (cartData: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData))
    } catch (err) {
      console.error("Error saving cart to storage:", err)
      setError("Failed to save cart changes")
    }
  }

  // Add item to cart
  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    try {
      setError(null)

      setCart((prevCart) => {
        const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)

        let newCart: CartItem[]
        if (existingItem) {
          // Update quantity if item already exists
          newCart = prevCart.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem,
          )
        } else {
          // Add new item to cart
          newCart = [...prevCart, { ...item, quantity }]
        }

        saveCartToStorage(newCart)
        return newCart
      })
    } catch (err) {
      setError("Failed to add item to cart")
      console.error("Error adding to cart:", err)
    }
  }

  // Update item quantity
  const updateQuantity = async (id: number, newQuantity: number) => {
    try {
      setError(null)

      // Simulate a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 200))

      setCart((prevCart) => {
        const newCart = prevCart.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item,
        )
        saveCartToStorage(newCart)
        return newCart
      })
    } catch (err) {
      setError("Failed to update quantity")
      console.error("Error updating quantity:", err)
    }
  }

  // Remove item from cart
  const removeFromCart = async (id: number) => {
    try {
      setError(null)

      // Simulate a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 200))

      setCart((prevCart) => {
        const newCart = prevCart.filter((item) => item.id !== id)
        saveCartToStorage(newCart)
        return newCart
      })
    } catch (err) {
      setError("Failed to remove item")
      console.error("Error removing item:", err)
    }
  }

  // Clear entire cart
  const clearCart = async () => {
    try {
      setError(null)

      // Simulate a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300))

      setCart([])
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch (err) {
      setError("Failed to clear cart")
      console.error("Error clearing cart:", err)
    }
  }

  // Get cart item count
  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Check if item is in cart
  const isInCart = (id: number) => {
    return cart.some((item) => item.id === id)
  }

  // Get specific item from cart
  const getCartItem = (id: number) => {
    return cart.find((item) => item.id === id)
  }

  // Load cart from localStorage on component mount
  useEffect(() => {
    loadCartFromStorage()
  }, [])

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.promoPrice || item.price) * item.quantity, 0)
  const savings = cart.reduce((sum, item) => {
    if (item.promoPrice) {
      return sum + (item.price - item.promoPrice) * item.quantity
    }
    return sum
  }, 0)

  const itemCount = getCartItemCount()

  return {
    cart,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refetchCart: loadCartFromStorage,
    subtotal,
    savings,
    itemCount,
    isInCart,
    getCartItem,
  }
}
