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
                <DateRangeFilter @update="dateFilter = $event" />
            </div>
        </div>
        <TransactionTable :transactions="filteredTransactions" />
        <DetailSidebar title="Transaction Details" :show="!!selectedTransactionId" @close="selectedTransactionId = null">
            <TransactionDetail v-if="selectedTransactionId" :transaction-id="selectedTransactionId" />
        </DetailSidebar>
      </div>
    </div>

    <div v-else class="text-center mt-16">
      <h2 class="text-xl font-semibold text-gray-600">Select an Account</h2>
      <p class="text-gray-500">Please select an account from the sidebar to view its details.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { getRekeningById, getTransactions } from '../api/mockApi';
import SaldoChart from '../components/charts/SaldoChart.vue';
import TransactionTable from '../components/specific/TransactionTable.vue';
import DateRangeFilter from '../components/common/DateRangeFilter.vue';
import DetailSidebar from '../components/common/DetailSidebar.vue';
import TransactionDetail from '../components/specific/TransactionDetail.vue';
const props = defineProps({ id: String });

const rekening = ref(null);
const allTransactions = ref([]);
const loading = ref(false);

const typeFilter = ref('all');
const dateFilter = ref({ start: null, end: null });
const selectedTransactionId = ref(null); // NEW: Track selected transaction

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

const filteredTransactions = computed(() => {
    return allTransactions.value.filter(t => {
        const typeMatch = typeFilter.value === 'all' || t.type === typeFilter.value;
        const startDate = dateFilter.value.start ? new Date(dateFilter.value.start) : null;
        const endDate = dateFilter.value.end ? new Date(dateFilter.value.end) : null;
        const transactionDate = new Date(t.datum);

        let dateMatch = true;
        if(startDate && endDate) {
            dateMatch = transactionDate >= startDate && transactionDate <= endDate;
        } else if (startDate) {
            dateMatch = transactionDate >= startDate;
        } else if (endDate) {
            dateMatch = transactionDate <= endDate;
        }

        return typeMatch && dateMatch;
    });
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