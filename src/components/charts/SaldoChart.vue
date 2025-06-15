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
  
  const labels = ['Start Saldo'];
  const dataPointsAll = [props.initialSaldo];
  const dataPointsPaid = [props.initialSaldo];

  let currentSaldoAll = props.initialSaldo;
  let currentSaldoPaid = props.initialSaldo;

  sortedTransactions.forEach(t => {
    labels.push(new Date(t.datum).toLocaleDateString('nl-NL'));
    
    let change = 0;
    if (t.type === 'INCOME') {
      change = t.bedrag;
    } else if (t.type === 'EXPENSE') {
      change = -t.bedrag;
    }
    
    currentSaldoAll += change;
    dataPointsAll.push(currentSaldoAll);

    if (t.status === 'PAID') {
      currentSaldoPaid += change;
    }
    dataPointsPaid.push(currentSaldoPaid);
  });

  return {
    labels,
    datasets: [
      {
        label: 'Verwachte Saldo',
        backgroundColor: '#93c5fd', // Lighter blue
        borderColor: '#3b82f6',     // Blue-500
        data: dataPointsAll,
        tension: 0.1,
      },
      {
        label: 'Betaalde Saldo',
        backgroundColor: '#a7f3d0', // Lighter green
        borderColor: '#10b981',     // Green-500
        data: dataPointsPaid,
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