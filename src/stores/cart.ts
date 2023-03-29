import { defineStore } from 'pinia'

const _items: any[] = []
export const useCartStore = defineStore('cart', {
  state: () => {
    return {
      items: _items
    }
  },
  getters: {
    lists: (state) => {
      return state.items
    },
    total: (state) => {
      return state.items.reduce((acc, obj) => {
        return acc + obj.price
      }, 0)
    }
  },
  actions: {
    addToCart(obj: any) {
      this.items.push(obj)
    },
    removeItem(id: string) {
      const i = this.items.findIndex((x) => x.id === id)
      if (i > -1) this.items.splice(i, 1)
    },
    clearCart() {
      this.items = []
    }
  }
})
