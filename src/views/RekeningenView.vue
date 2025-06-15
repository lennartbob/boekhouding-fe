<!-- src/views/RekeningenView.vue -->
<template>
  <div>
    <div v-if="loading" class="text-center text-gray-500">Loading account details...</div>
    
    <div v-else-if="rekening">
      <h2 class="text-2xl font-semibold text-gray-700">{{ rekening.name }} - {{ formatCurrency(rekening.saldo) }}</h2>

      <div class="mt-8">
        <SaldoChart :transactions="allTransactions" :initial-saldo="rekening.saldo"/>
      </div>

      <div class="mt-8">
        <div class="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow">
            <h3 class="text-lg font-semibold">Transactions</h3>
            <div class="flex items-center space-x-4">
                <select v-model="typeFilter" class="form-input">
                    <option value="all">All Types</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                </select>
                <!-- Added a key to ensure the component resets when filters are cleared -->
                <DateRangeFilter :key="dateFilterKey" @update="dateFilter = $event" />
                
                <!-- 4) Clear Filters Button -->
                <button 
                  @click="clearFilters" 
                  class="flex items-center px-3 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  title="Clear all filters"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            </div>
        </div>
        <TransactionTable :transactions="filteredTransactions" @row-click="showTransactionDetail" />
        <DetailSidebar title="Transaction Details" :show="!!selectedTransactionId" @close="selectedTransactionId = null">
            <TransactionDetail v-if="selectedTransactionId" :transaction-id="selectedTransactionId" />
        </DetailSidebar>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { getRekeningById, getTransactions } from '../api/mockApi';
import SaldoChart from '../components/charts/SaldoChart.vue';
import TransactionTable from '../components/specific/TransactionTable.vue';
import DateRangeFilter from '../components/common/DateRangeFilter.vue';
import DetailSidebar from '../components/common/DetailSidebar.vue';
import TransactionDetail from '../components/specific/TransactionDetail.vue';

const props = defineProps({ id: String });

const rekening = ref(null);
const allTransactions = ref([]);
const loading = ref(true);

const typeFilter = ref('all');
const dateFilter = ref({ start: null, end: null });
const dateFilterKey = ref(0); // NEW: Key for re-rendering DateRangeFilter
const selectedTransactionId = ref(null);

const showTransactionDetail = (transaction) => {
    selectedTransactionId.value = transaction.id;
};

const fetchData = async (rekeningId) => {
    if (!rekeningId) {
        rekening.value = null;
        allTransactions.value = [];
        return;
    };
    loading.value = true;
    const [rekeningData, transactionsData] = await Promise.all([
        getRekeningById(rekeningId),
        getTransactions({ rekeningId }),
    ]);
    rekening.value = rekeningData;
    allTransactions.value = transactionsData;
    loading.value = false;
};

// NEW: Function to clear all active filters
const clearFilters = () => {
    typeFilter.value = 'all';
    dateFilter.value = { start: null, end: null };
    dateFilterKey.value++; // Increment key to force DateRangeFilter to re-render and reset
};

const filteredTransactions = computed(() => {
    return allTransactions.value.filter(t => {
        const typeMatch = typeFilter.value === 'all' || t.type === typeFilter.value;
        const startDate = dateFilter.value.start ? new Date(dateFilter.value.start) : null;
        const endDate = dateFilter.value.end ? new Date(dateFilter.value.end) : null;
        const transactionDate = new Date(t.datum);

        let dateMatch = true;
        if (startDate && endDate) {
            // Adjust end date to be inclusive of the entire day
            const adjustedEndDate = new Date(endDate);
            adjustedEndDate.setHours(23, 59, 59, 999);
            dateMatch = transactionDate >= startDate && transactionDate <= adjustedEndDate;
        } else if (startDate) {
            dateMatch = transactionDate >= startDate;
        } else if (endDate) {
             const adjustedEndDate = new Date(endDate);
            adjustedEndDate.setHours(23, 59, 59, 999);
            dateMatch = transactionDate <= adjustedEndDate;
        }

        return typeMatch && dateMatch;
    }).sort((a, b) => new Date(b.datum) - new Date(a.datum)); // Also added sorting
});

watch(() => props.id, (newId) => {
    fetchData(newId);
}, { immediate: true });

const formatCurrency = (value) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value);
</script>

<style scoped>
.form-input {
  @apply block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
}
</style>