<script lang="ts" setup>
import LoadingView from '@/components/LoadingView.vue'
import { useAuthStore } from '@/stores/AuthStore'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = useAuthStore()

onMounted(async () => {
  const { token, redirect } = route.query
  console.log('receive token', token)
  if (token) {
    try {
      // Validate token with server.
      store.login(token as string)
      // Redirect to home screen
      if (redirect) {
        router.push(redirect as string)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.log('load news fails', error)
    }
  }
})
</script>
<template>
  <LoadingView />
</template>
