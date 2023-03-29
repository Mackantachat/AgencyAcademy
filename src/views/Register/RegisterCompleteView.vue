<script setup lang="ts">
import { useRegisterStore } from '@/stores/RegisterStore'
import { onMounted } from 'vue'

const store = useRegisterStore()
const userName = store.registerInfo?.username

onMounted(() => {
  // Reset store once registration is completed.
  store.$reset()
})
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
        คุณลงทะเบียนสำเร็จแล้ว
      </p>
      <p class="text-center mb-0">ชื่อผู้ใช้งาน (Username)</p>
      <p class="text-center text-primary fw-bold mb-0">{{ userName }}</p>
      <div class="footer-content">
        <div class="container px-4 text-center mb-3">
          <p class="text-center text-primary fw-bold">
            กรุณารอยืนยันการเข้าใช้งานระบบ<br />จากตัวแทนอ้างอิง (หน่วย)
          </p>
        </div>
        <!-- <div class="container px-4 text-center">
          <RouterLink
            :to="{ name: 'Login' }"
            class="btn btn-green text-primary w-75"
            >เข้าสู่ระบบ</RouterLink
          >
        </div> -->
      </div>
    </div>
  </div>
</template>
