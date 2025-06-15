<!-- src/components/specific/PartyDetail.vue -->
<template>
  <div v-if="party" class="space-y-4">
    <div>
      <h4 class="text-sm font-medium text-gray-500">Adres</h4>
      <p class="mt-1 text-gray-900">{{ party.adres }}</p>
    </div>
    <div>
      <h4 class="text-sm font-medium text-gray-500">IBAN</h4>
      <p class="mt-1 text-gray-900">{{ party.iban }}</p>
    </div>
    <div class="pt-4">
      <h4 class="text-md font-semibold text-gray-800 mb-2">Recent Transactions</h4>
      <div v-if="loading" class="text-center text-gray-500">Loading transactions...</div>
      <!-- Use the simplified headers -->
      <AppTable v-else :headers="transactionHeaders" :items="transactions" >
          <template #cell(bedrag)="{ value, item }">
              <span :class="item.type === 'INCOME' ? 'text-green-600' : 'text-red-600'">
                  {{ item.type === 'INCOME' ? '+' : '-' }} {{ formatCurrency(value) }}
              </span>
          </template>
          <template #cell(datum)="{ value }">
              {{ new Date(value).toLocaleDateString('nl-NL') }}
          </template>
      </AppTable>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { getTransactions } from '../../api/mockApi';
import AppTable from '../common/AppTable.vue';

const props = defineProps({ party: Object });
const transactions = ref([]);
const loading = ref(false);

// Simplified headers for this specific view
const transactionHeaders = [
    { key: 'datum', label: 'Datum' },
    { key: 'bedrag', label: 'Bedrag' }
];

const fetchTransactions = async (partyId) => {
    // ... same fetch logic as before
    if (!partyId) return;
    loading.value = true;
    transactions.value = await getTransactions({ partyId });
    loading.value = false;
};

onMounted(() => {
    if (props.party) fetchTransactions(props.party.id);
});

watch(() => props.party, (newParty) => {
    if (newParty) {
        fetchTransactions(newParty.id);
    } else {
        transactions.value = [];
    }
}, { immediate: true });

const formatCurrency = (value) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value);
</script>