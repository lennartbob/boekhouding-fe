<!-- src/views/FacturenView.vue -->
<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-700">Facturen</h2>
    <div class="mt-8">
      <AppTable :headers="headers" :items="facturen" @row-click="showFactuurDetail">
        <template #cell(datum)="{ value }">
            {{ new Date(value).toLocaleDateString('nl-NL') }}
        </template>
        <template #cell(type)="{ value }">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize"
                :class="value === 'verkoop' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'">
                {{ value }}
            </span>
        </template>
      </AppTable>
    </div>

    <DetailSidebar title="Factuur Details" :show="!!selectedFactuur" @close="selectedFactuur = null">
      <FactuurDetail 
        :factuur="selectedFactuur" 
        @deleted="handleFactuurDeleted"
        @updated="handleFactuurUpdated"
      />
    </DetailSidebar>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFacturen } from '../api/mockApi';
import AppTable from '../components/common/AppTable.vue';
import DetailSidebar from '../components/common/DetailSidebar.vue';
import FactuurDetail from '../components/specific/FactuurDetail.vue';
const facturen = ref([]);
const selectedFactuur = ref(null);

const fetchFacturen = async () => {
    facturen.value = await getFacturen();
}
onMounted(fetchFacturen);

const showFactuurDetail = (factuur) => {
  selectedFactuur.value = factuur;
};

const handleFactuurDeleted = (deletedId) => {
    facturen.value = facturen.value.filter(f => f.id !== deletedId);
    selectedFactuur.value = null; // Close the sidebar
};

const handleFactuurUpdated = async () => {
    // Easiest way to reflect change is to refetch all data
    await fetchFacturen();
    // Find the updated factuur in the new list to keep sidebar open with fresh data
    const updatedFactuur = facturen.value.find(f => f.id === selectedFactuur.value.id);
    selectedFactuur.value = updatedFactuur;
};
</script>