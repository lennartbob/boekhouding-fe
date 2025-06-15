<!-- src/components/common/BaseModal.vue -->
<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-60 z-40" @click="close"></div>
  </transition>
  <transition name="pop">
    <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg m-4" @click.stop>
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">
            <slot name="title">Modal Title</slot>
          </h3>
          <button @click="close" class="text-gray-400 hover:text-gray-700">×</button>
        </div>
        <div class="p-6">
          <slot name="body">Modal Body</slot>
        </div>
        <div v-if="$slots.footer" class="p-4 bg-gray-50 border-t rounded-b-lg flex justify-end space-x-2">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
});
const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.pop-enter-active { transition: all 0.3s ease; }
.pop-leave-active { transition: all 0.3s ease; }
.pop-enter-from, .pop-leave-to { transform: translateY(-20px) scale(0.95); opacity: 0; }
</style>