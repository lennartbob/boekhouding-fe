<!-- src/views/RekeningenView.vue -->
<template>
  <div>
    <!-- ... (v-if loading / rekening) ... -->
    <div v-if="rekening">
        <!-- ... h2, SaldoChart, filters ... -->
        <div class="mt-8">
            <!-- ... filter bar ... -->
            <TransactionTable :transactions="filteredTransactions" @row-click="showTransactionDetail" />
        </div>
    </div>
    <!-- ... v-else ... -->
    
    <DetailSidebar title="Transaction Details" :show="!!selectedTransactionId" @close="selectedTransactionId = null">
        <TransactionDetail v-if="selectedTransactionId" :transaction-id="selectedTransactionId" />
    </DetailSidebar>
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
const selectedTransactionId = ref(null);

const typeFilter = ref('all');
const dateFilter = ref({ start: null, end: null });

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
const showTransactionDetail = (transaction) => {
    selectedTransactionId.value = transaction.id;
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