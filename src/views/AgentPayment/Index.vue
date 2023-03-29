<script setup lang="ts">
import Header from '@/components/layouts/HeaderView.vue'
import Loading from '@/components/LoadingView.vue'
import AgentPayment from '@/components/AgentPayment.vue'
</script>
<template>
  <Header />
  <div class="page full-page">
    <div class="container px-3 py-4">
      <h1 class="text-primary fw-bold fs-4">ชำระค่าธรรมเนียมธุรกรรมตัวแทน</h1>
      <AgentPayment />
    </div>
  </div>

  <!-- <Loading v-if="!isLoaded" /> -->
</template>
