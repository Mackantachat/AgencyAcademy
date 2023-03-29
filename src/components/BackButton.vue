<script setup lang="ts">
import Icon from '@/components/icons/Index.vue'
import IconBack from '@/components/icons/Back.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: { type: String, default: 'ย้อนกลับ' },
  to: String
})
const { back, push } = useRouter()

const goBack = (evt: Event) => {
  console.log('go back')
  if (props.to) {
    push(props.to)
  } else {
    back()
  }
}
</script>
<template>
  <button
    class="btn text-primary d-inline-flex align-items-center p-0"
    type="button"
    @click.prevent="goBack"
  >
    <Icon :width="16" :height="16" class="me-1"><IconBack /></Icon>
    {{ title }}
  </button>
</template>
