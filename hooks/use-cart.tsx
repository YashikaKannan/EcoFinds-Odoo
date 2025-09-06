"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useAuth } from "./use-auth"
import { toast } from "sonner"

interface CartItem {
  productId: {
    _id: string
    title: string
    price: number
    imageUrl: string
    userId: {
      username: string
    }
  }
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  totalAmount: number
  itemCount: number
  loading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<boolean>
  removeFromCart: (productId: string) => Promise<boolean>
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>
  refreshCart: () => Promise<void>
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const refreshCart = async () => {
    if (!user) {
      setItems([])
      setTotalAmount(0)
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data = await response.json()
        setItems(data.cart.products || [])
        setTotalAmount(data.cart.totalAmount || 0)
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity = 1): Promise<boolean> => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      })

      if (response.ok) {
        await refreshCart()
        return true
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to add to cart")
        return false
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add to cart")
      return false
    }
  }

  const removeFromCart = async (productId: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        await refreshCart()
        toast.success("Removed from cart")
        return true
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to remove from cart")
        return false
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast.error("Failed to remove from cart")
      return false
    }
  }

  const updateQuantity = async (productId: string, quantity: number): Promise<boolean> => {
    try {
      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      })

      if (response.ok) {
        await refreshCart()
        return true
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to update cart")
        return false
      }
    } catch (error) {
      console.error("Error updating cart:", error)
      toast.error("Failed to update cart")
      return false
    }
  }

  const clearCart = () => {
    setItems([])
    setTotalAmount(0)
  }

  useEffect(() => {
    refreshCart()
  }, [user])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        totalAmount,
        itemCount,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        refreshCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
