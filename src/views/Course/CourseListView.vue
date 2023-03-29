<script setup lang="ts">
import type { AcademyTraining } from '@/types'
import CourseBox from '@/components/CourseBox.vue'
defineProps<{
  items?: AcademyTraining[]
}>()

const emit = defineEmits<{
  (e: 'itemClick', id: string): void
}>()
</script>

<template>
  <div class="course-contains">
    <div class="row g-3 p-1">
      <slot name="header"></slot>
      <div class="col-12" v-if="!items || items.length <= 0">
        <p class="text-primary fw-bold text-center mt-4">ไม่พบข้อมูล</p>
      </div>
      <div
        v-else
        class="col-12"
        v-for="item in items"
        :key="item.trainingScheduleID"
      >
        <CourseBox
          :item="item"
          available-status="available_status"
          status="item.status"
          class="item.status"
          @click="emit('itemClick', item.trainingScheduleID)"
        />
      </div>
    </div>
  </div>
</template>
