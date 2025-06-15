<!-- src/App.vue -->
<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    <AppSidebar />

    <main class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="container mx-auto px-6 py-8">
          <router-view :key="$route.fullPath"></router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AppSidebar from './components/layout/AppSidebar.vue';
</script>