<script lang="ts" setup>
import LoadingView from '@/components/LoadingView.vue'
import Modal from '@/components/Modal.vue'
import { searchAgent } from '@/services/AcademyService'
import type { AgentProfile } from '@/types'
import { Field, Form } from 'vee-validate'
import { reactive, onMounted } from 'vue'

const props = defineProps<{
  searchText: string
}>()

const emit = defineEmits<{
  (e: 'itemSelected', item: AgentProfile): void
  (e: 'onDismiss'): void
  (e: 'onError', error: any): void
}>()

const _items: AgentProfile[] = []
const state = reactive({
  items: _items,
  isLoaded: false
})

const doCancel = () => {
  emit('onDismiss')
}

const doSubmit = (values: any) => {
  emit('itemSelected', values)
}

onMounted(async () => {
  // Query
  state.isLoaded = false
  try {
    const result = await searchAgent(props.searchText)
    if (result) {
      state.items = [...result]
    }
  } catch (error) {
    emit('onError', error)
  } finally {
    state.isLoaded = true
  }
})
</script>
<template>
  <!-- Referral Modal -->
  <div>
    <Modal v-if="state.isLoaded">
      <h4 class="fs-5 fw-bold">ผลการค้นหา</h4>
      <Form @submit="doSubmit">
        <div class="row g-3">
          <div class="col-12" v-for="item in state.items" :key="item.agentCode">
            <div class="form-check">
              <Field
                class="form-check-input"
                type="radio"
                name="agentCode"
                :id="`referral-option-${item.agentCode}`"
                :value="item.agentCode"
              />
              <label
                class="form-check-label"
                :for="`referral-option-${item.agentCode}`"
              >
                {{ item.agentFullName }} ({{ item.agentCode }})
              </label>
            </div>
          </div>
          <div class="col-12 text-end">
            <button class="btn btn-light me-2" type="button" @click="doCancel">
              ยกเลิก
            </button>
            <button class="btn btn-primary" type="submit">ยืนยัน</button>
          </div>
        </div>
      </Form>
    </Modal>
    <LoadingView v-else />
  </div>
</template>
