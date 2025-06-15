<template>
  <div class="flex items-center space-x-2">
    <input type="date" v-model="start" @change="emitUpdate" class="form-input"/>
    <span>-</span>
    <input type="date" v-model="end" @change="emitUpdate" class="form-input"/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['update']);
const start = ref('');
const end = ref('');
const emitUpdate = () => {
  emit('update', { start: start.value, end: end.value });
};
</script>

<style scoped>
.form-input {
  @apply block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
}
</style>