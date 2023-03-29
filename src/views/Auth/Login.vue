<script setup lang="ts">
import { RouterLink } from "vue-router";
import Logo from "@/components/Logo.vue";
</script>

<template>
  <div class="full-page">
    <section class="py-5">
      <div class="container px-4">
        <Logo class="mx-auto mb-4" />
        <form action="">
          <p class="text-center fw-bold mb-4">
            ยินดีต้อนรับเข้าสู่ระบบบริการออนไลน์
          </p>
          <div class="row g-3">
            <div class="col-12">
              <label for="username" class="mb-1"
                >ชื่อผู้ใช้งาน (Username)<span class="text-danger"
                  >*</span
                ></label
              >
              <input
                type="text"
                class="form-control"
                name="username"
                id="username"
                autofocus
              />
            </div>
            <div class="col-12">
              <label for="password" class="mb-1"
                >รหัสผ่าน (Password)<span class="text-danger">*</span></label
              >
              <input
                type="password"
                class="form-control"
                name="password"
                id="password"
              />
            </div>
            <div class="col-12 text-end">
              <RouterLink to="/auth/forget-username" class="me-2"
                >ลืมชื่อผู้ใช้</RouterLink
              >|
              <RouterLink to="/auth/forget-password" class="ms-2"
                >ลืมรหัสผ่าน</RouterLink
              >
            </div>
          </div>
          <div class="footer-content">
            <div class="container px-4 text-center">
              <button class="btn btn-green text-primary w-75">
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>
