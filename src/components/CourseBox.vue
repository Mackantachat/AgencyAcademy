<script setup lang="ts">
import Icon from '@/components/icons/Index.vue'
import IconCalendar from '@/components/icons/Calendar.vue'
import type { AcademyTraining } from '@/types'

defineProps<{ item: AcademyTraining }>()
</script>

<template>
  <div class="course-box">
    <div class="course-title py-2 px-3 d-flex align-items-center">
      <div class="icon-contains">
        <Icon :width="26" :height="26">
          <IconCalendar />
        </Icon>
      </div>
      <div class="col-10">
        <h4 class="m-0 fw-bold">
          {{ item.trainingDateTime }}
        </h4>
      </div>
    </div>
    <div class="course-body p-3">
      <h3 class="mb-2 text-primary">
        {{ item.courseTitle }}
      </h3>
      <p class="m-0">
        ประเภทอบรม: <span class="text-primary">{{ item.trainingModel }}</span>
      </p>
      <p class="m-0">
        จำนวนที่นั่งเหลือ:
        <span class="text-primary">{{ item.seat }}</span>
      </p>
      <p class="m-0">
        สถานะ:
        <span class="text-primary">{{ item.trainingStatus }}</span>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.course-box {
  border-radius: 0.25rem;
  box-shadow: 0px 1px 3px 0px rgba($black, 0.15);
  display: block;
  overflow: hidden;
  user-select: none;
  cursor: pointer;
  .course-title {
    background-color: $blue-pale;
    color: $primary;
    .icon-contains {
      flex: 0 0 40px;
      max-width: 40px;
    }
    h4 {
      flex: 0 0 calc(100% - 40px);
      font-size: 20px;
      max-width: calc(100% - 40px);
    }
  }
  .course-body {
    background-color: $white;
    color: #242424;
    h3 {
      font-size: 20px;
    }
  }
  &.pending {
    .course-title {
      background-color: $light-blue;
      color: $white;
    }
  }
  &.paid {
    .course-title {
      background-color: $primary;
      color: $white;
    }
  }
  &.not_paid,
  &.canceled,
  &.canceled_by_company,
  &.failed,
  &.absented {
    .course-title {
      background-color: $gray;
      color: $white;
    }
  }
}
</style>
