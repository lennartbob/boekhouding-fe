<!-- src/components/charts/SaldoChart.vue -->
<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
  initialSaldo: {
    type: Number,
    required: true,
  },
});

const chartData = computed(() => {
  // Sort transactions by date ascending
  const sortedTransactions = [...props.transactions].sort((a, b) => new Date(a.datum) - new Date(b.datum));
  
  const labels = ['Start'];
  const dataPoints = [props.initialSaldo];
  let currentSaldo = props.initialSaldo;

  sortedTransactions.forEach(t => {
    labels.push(new Date(t.datum).toLocaleDateString('nl-NL'));
    if(t.type === 'INCOME') {
      currentSaldo += t.bedrag;
    } else if (t.type === 'EXPENSE') {
      currentSaldo -= t.bedrag;
    }
    // 'TRANSFER' is neutral for this account's perspective in this simple model
    dataPoints.push(currentSaldo);
  });

  return {
    labels,
    datasets: [
      {
        label: 'Saldo Ontwikkeling',
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        data: dataPoints,
        tension: 0.1,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
};
</script>