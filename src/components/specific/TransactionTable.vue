<!-- src/components/specific/TransactionTable.vue -->
<template>
  <AppTable :headers="headers" :items="transactions" @row-click="$emit('rowClick', $event)">
    <template #cell(bedrag)="{ value, item }">
      <!-- This cell is now Totaal Bedrag -->
      <span :class="item.type === 'INCOME' ? 'text-green-600' : 'text-red-600'">
        {{ item.type === 'INCOME' ? '+' : '-' }} {{ formatCurrency(value * (1 + item.btw)) }}
      </span>
    </template>
    <template #cell(datum)="{ value }">
      {{ new Date(value).toLocaleDateString('nl-NL') }}
    </template>
    <template #cell(btw)="{ item }">
        {{ formatCurrency(item.bedrag * item.btw) }} ({{ item.btw * 100 }}%)
    </template>
    <template #cell(status)="{ value }">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
            :class="value === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
            {{ value }}
        </span>
    </template>
  </AppTable>
</template>

<script setup>
import AppTable from '../common/AppTable.vue';
defineProps({
    transactions: { type: Array, required: true }
});
defineEmits(['rowClick']);

const headers = [
  { key: 'datum', label: 'Datum' },
  { key: 'omscrhijving', label: 'Omschrijving' },
  { key: 'bedrag', label: 'Totaal Bedrag' }, // This will now represent the total amount
  { key: 'btw', label: 'BTW' },
  { key: 'type', label: 'Type' },
  { key: 'status', label: 'Status' },
];
const formatCurrency = (value) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value);
</script>