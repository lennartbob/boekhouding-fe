<!-- src/components/specific/BtwOverview.vue -->
<template>
    <div class="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">BTW Overzicht</h2>
            <div class="flex items-center space-x-2">
                <label for="year-select" class="text-sm font-medium text-gray-600">Jaar:</label>
                <select id="year-select" v-model="selectedYear" class="form-input py-1.5 text-sm">
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>
        </div>

        <div v-if="loading" class="text-center text-gray-500 py-10">
            <p>BTW-gegevens voor {{ selectedYear }} worden geladen...</p>
        </div>

        <div v-else-if="overviewData" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BtwQuarterBox 
                v-for="(quarterData, quarterName) in overviewData" 
                :key="quarterName"
                :title="`${quarterName}, ${selectedYear}`" 
                :data="quarterData"
            />
        </div>
        
        <div v-else class="text-center text-gray-500 py-10">
            <p>Geen gegevens gevonden voor het geselecteerde jaar.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getBtwOverview } from '../../api/mockApi';
import BtwQuarterBox from './BtwQuarterBox.vue';

const years = [2022, 2023, 2024, 2025];
const selectedYear = ref(new Date().getFullYear());
const overviewData = ref(null);
const loading = ref(true);

const fetchBtwData = async (year) => {
    loading.value = true;
    overviewData.value = null; // Clear previous data
    try {
        overviewData.value = await getBtwOverview(year);
    } catch (error) {
        console.error(`Failed to fetch BTW overview for ${year}:`, error);
    } finally {
        loading.value = false;
    }
};

watch(selectedYear, (newYear) => {
    fetchBtwData(newYear);
}, { immediate: true });

</script>

<style scoped>
.form-input {
  @apply block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
}
</style>