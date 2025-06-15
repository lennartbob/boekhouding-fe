<!-- src/components/specific/TotalSaldoOverview.vue -->
<template>
<div class="bg-white p-6 rounded-lg shadow space-y-6">
<h3 class="text-xl font-semibold text-gray-800">Totaal Saldo Overzicht</h3>
<div v-if="loading" class="text-center text-gray-500 py-10">
    <p>Saldo gegevens worden geladen...</p>
</div>

<div v-else>
    <!-- Chart -->
    <div class="h-80 mb-6">
      <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    </div>

    <!-- Subtotals -->
    <div>
      <h4 class="text-lg font-medium text-gray-700 mb-2">Huidig Saldo per Rekening</h4>
      <ul class="divide-y divide-gray-200">
        <li v-for="rekening in rekeningenWithSubtotals" :key="rekening.id" class="py-3 flex justify-between items-center">
          <span class="text-gray-800">{{ rekening.name }}</span>
          <span class="font-semibold text-base" :class="rekening.currentSaldo >= 0 ? 'text-gray-900' : 'text-red-600'">
            {{ formatCurrency(rekening.currentSaldo) }}
          </span>
        </li>
      </ul>
    </div>
</div>
</div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { getRekeningen, getTransactions } from '../../api/mockApi';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler);

const rekeningen = ref([]);
const transactions = ref([]);
const loading = ref(true);

const chartColors = [
'#4f46e5', // Indigo
'#10b981', // Green
'#f59e0b', // Amber
'#3b82f6', // Blue
'#ef4444', // Red
'#8b5cf6', // Violet
];
const totalSaldoColor = '#0f172a'; // Slate-900 for the total

const fetchData = async () => {
loading.value = true;
try {
const [rekeningenData, transactionsData] = await Promise.all([
getRekeningen(),
getTransactions(),
]);
rekeningen.value = rekeningenData;
transactions.value = transactionsData;
} catch (error) {
console.error("Failed to fetch saldo overview data:", error);
} finally {
loading.value = false;
}
};

onMounted(fetchData);

const chartData = computed(() => {
if (loading.value || !rekeningen.value.length) return null;

// 1. Prepare initial state
const labels = ['Start Saldo'];

const rekeningDatasets = rekeningen.value.map((rekening, index) => ({
label: rekening.name,
data: [rekening.saldo],
borderColor: chartColors[index % chartColors.length],
backgroundColor: chartColors[index % chartColors.length] + '33', // Add some transparency
tension: 0.1,
fill: false,
}));

const initialTotalSaldo = rekeningen.value.reduce((sum, r) => sum + r.saldo, 0);
const totalSaldoDataset = {
label: 'Totaal Verwachte Saldo',
data: [initialTotalSaldo],
borderColor: totalSaldoColor,
backgroundColor: totalSaldoColor + '1A', // Light transparency
tension: 0.1,
fill: true,
borderWidth: 2.5,
order: 99, // Render on top of other datasets
};

// 2. Group transactions by date for efficient processing
const transactionsByDate = {};
[...transactions.value]
.sort((a, b) => new Date(a.datum) - new Date(b.datum))
.forEach(t => {
const dateKey = new Date(t.datum).toISOString().split('T')[0];
if (!transactionsByDate[dateKey]) {
transactionsByDate[dateKey] = [];
}
transactionsByDate[dateKey].push(t);
});

const sortedDates = Object.keys(transactionsByDate);

// 3. Process each day with transactions to build the graph data
sortedDates.forEach(dateKey => {
labels.push(new Date(dateKey).toLocaleDateString('nl-NL'));

const dailyTransactions = transactionsByDate[dateKey];

rekeningen.value.forEach((rekening, index) => {
const lastSaldo = rekeningDatasets[index].data.slice(-1)[0];

const dailyChangeForRekening = dailyTransactions
.filter(t => t.rekening_id === rekening.id)
.reduce((sum, t) => {
if (t.type === 'INCOME') return sum + t.bedrag;
if (t.type === 'EXPENSE' || t.type === 'TRANSFER') return sum - t.bedrag;
return sum;
}, 0);

const newSaldo = lastSaldo + dailyChangeForRekening;
rekeningDatasets[index].data.push(newSaldo);
});

// Recalculate total from the sum of the latest data points of individual rekeningen.
const newTotalSaldo = rekeningDatasets.reduce((total, ds) => total + ds.data.slice(-1)[0], 0);
totalSaldoDataset.data.push(newTotalSaldo);
});

return {
labels,
datasets: [totalSaldoDataset, ...rekeningDatasets],
};
});

const rekeningenWithSubtotals = computed(() => {
if (loading.value) return [];

return rekeningen.value.map(rekening => {
const rekeningTransactions = transactions.value.filter(t => t.rekening_id === rekening.id);
const transactionTotal = rekeningTransactions.reduce((sum, t) => {
if (t.type === 'INCOME') return sum + t.bedrag;
if (t.type === 'EXPENSE' || t.type === 'TRANSFER') return sum - t.bedrag;
return sum;
}, 0);

const currentSaldo = rekening.saldo + transactionTotal;

return {
...rekening,
currentSaldo
};
});
});

const chartOptions = {
responsive: true,
maintainAspectRatio: false,
plugins: {
legend: {
display: true,
position: 'top',
}
},
scales: {
y: {
beginAtZero: false
}
},
interaction: {
intersect: false,
mode: 'index',
},
};

const formatCurrency = (value) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value);
</script>
