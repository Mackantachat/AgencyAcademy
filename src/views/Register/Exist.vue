<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Loading from '@/components/LoadingView.vue'
</script>
<template>
  <div class="full-page pt-4">
    <div class="container px-3">
      <img
        src="@/assets/img/P_BEE_MAI_A.svg"
        class="d-block mx-auto my-4 img-fluid"
        alt="P_BEE_MAI_A"
      />
      <p class="text-center text-primary fw-bold fs-5 mb-2">
        ท่านมีบัญชีผู้ใช้งานแล้ว
      </p>
      <div class="footer-content">
        <div class="container px-4 text-center">
          <RouterLink
            :to="{ name: 'Login' }"
            class="btn btn-green text-primary w-75"
            >เข้าสู่ระบบ</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
  <Loading v-if="!isLoaded" />
</template>

<script lang="ts">
export default {
  data() {
    return {
      isLoaded: false,
      username: 'pasika'
    }
  },
  mounted() {
    this.isLoaded = true
  }
}
</script>
