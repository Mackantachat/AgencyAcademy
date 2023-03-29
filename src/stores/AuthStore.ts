import {
  clearAccessToken,
  setAccessToken,
  validateAccessToken
} from '@/services/AcademyService'
import type { UserProfile } from '@/types/UserProfile'
import { defineStore } from 'pinia'
const logoutUrl = import.meta.env.VITE_LOGOUT_URL

interface AuthStore {
  profile?: UserProfile
}

export const useAuthStore = defineStore('AuthStore', {
  persist: true,
  // state
  state: (): AuthStore => ({ profile: undefined }),
  actions: {
    // Login with access token (provided by referer)
    async login(token: string) {
      const profiles = await validateAccessToken(token)
      if (profiles && profiles.length > 0) {
        const { token, ...profile } = profiles[0]
        const userid = profile.userid
        this.profile = profile
        setAccessToken(token, userid)
      }
    },

    // Logout
    async logout() {
      console.log('logout')
      this.profile = undefined
      clearAccessToken()

      try {
        // Invoke service when logut
        //await fetch(logoutUrl, { method: 'GET' })
        window.location.href = logoutUrl
      } catch (error) {
        console.log('Logout with service fails', error)
      }
    }
  },
  // getters
  getters: {
    isAuthenticated(state) {
      return state.profile !== undefined
    }
  }
})
