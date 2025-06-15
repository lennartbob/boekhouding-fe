<!-- src/views/DashboardView.vue -->
<template>
  <div class="space-y-8">
    <h2 class="text-4xl font-semibold text-gray-700">Dashboard</h2>
    <TotalSaldoOverview />

    <BtwOverview />

  </div>
</template>

<script setup>
import BtwOverview from '../components/specific/BtwOverview.vue';
import TotalSaldoOverview from '../components/charts/TotalSaldoOverview.vue';

</script>