<!-- src/components/common/DetailSidebar.vue -->
<template>
  <transition name="slide-fade">
    <div v-if="show" class="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-30 border-l border-gray-200 flex flex-col">
      <div class="p-4 border-b flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-800">×</button>
      </div>
      <div class="flex-1 p-6 overflow-y-auto">
        <slot></slot>
      </div>
    </div>
  </transition>
  <transition name="fade">
      <div v-if="show" @click="$emit('close')" class="fixed inset-0 bg-black bg-opacity-40 z-20"></div>
  </transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
});
defineEmits(['close']);
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: transform 0.3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateX(100%);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>