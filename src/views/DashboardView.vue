<!-- src/views/DashboardView.vue -->
<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-semibold text-gray-700">Dashboard</h2>
    
    <BtwOverview />

    <!-- Other dashboard components could go here -->
  </div>
</template>

<script setup>
import BtwOverview from '../components/specific/BtwOverview.vue';
</script>