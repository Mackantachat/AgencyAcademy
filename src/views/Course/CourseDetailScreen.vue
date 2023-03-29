<script setup lang="ts">
import { computed, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { AcademyTraining } from '@/types'
import { applyTraining, fetchTraining } from '@/services/AcademyService'
import { useAppModal } from '@/stores/TempStore'

import BackButton from '@/components/BackButton.vue'
import LoadingView from '@/components/LoadingView.vue'
import TrainingDetailView from '@/views/Course/TraningDetailView.vue'

const router = useRouter()
const route = useRoute()
const appModal = useAppModal()
// Load course detail
const { id } = route.params

onMounted(async () => {
  await fetchItem()
})

const state = reactive<{
  showPaymentInstruction: boolean
  showCancelModal: boolean
  item?: AcademyTraining
  loading: boolean
}>({
  showPaymentInstruction: false,
  showCancelModal: false,
  item: undefined,
  loading: false
})

const allowPayment = computed(() => {
  return state.item?.paymentFlag === 'Y'
})

const fetchItem = async () => {
  state.loading = true
  try {
    const training = await fetchTraining(id as string)
    state.item = training
  } finally {
    state.loading = false
  }
}

const doApply = async () => {
  state.loading = true
  try {
    const ok = await applyTraining(id as string)
    if (ok) {
      if (allowPayment.value) {
        // Continue to payment page if this item require payment
        router.push({ name: 'Payment', params: { id } })
      } else {
        // Registration completed.
        router.push({ name: 'Course' })
      }
    }
  } catch (error) {
    console.log('apply training error', error)
    if (error instanceof Error) {
      appModal.openModal('Error', error.message)
    }
  } finally {
    state.loading = false
  }
}
</script>

<template>
  <TrainingDetailView :item="state.item" @register-click="doApply">
    <template #top>
      <div class="row align-items-center mb-3">
        <div class="col-6">
          <BackButton />
        </div>
      </div>
    </template>
  </TrainingDetailView>

  <LoadingView v-if="state.loading" />
</template>
