<!-- src/components/specific/TransactionDetail.vue -->
<template>
  <div v-if="loading" class="text-center text-gray-500">Loading details...</div>
  <div v-else-if="transaction" class="space-y-6">
    <!-- Transaction Info -->
    <div>
        <h4 class="text-sm font-medium text-gray-500">Omschrijving</h4>
        <p class="mt-1 text-lg text-gray-900">{{ transaction.omscrhijving }}</p>
    </div>
    <div class="grid grid-cols-2 gap-4">
        <div>
            <h4 class="text-sm font-medium text-gray-500">Bedrag</h4>
            <p class="mt-1 text-gray-900" :class="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrency(transaction.bedrag) }}
            </p>
        </div>
        <div>
            <h4 class="text-sm font-medium text-gray-500">Datum</h4>
            <p class="mt-1 text-gray-900">{{ new Date(transaction.datum).toLocaleDateString('nl-NL') }}</p>
        </div>
    </div>

    <!-- Party Info -->
    <div class="pt-4 border-t">
        <h3 class="font-semibold text-gray-800 mb-2">Partij</h3>
        <div v-if="party">
            <p class="text-gray-900 font-medium">{{ party.name }}</p>
            <p class="text-sm text-gray-600">{{ party.iban }}</p>
        </div>
        <div v-else class="text-sm text-gray-500">No party associated.</div>
    </div>

    <!-- Factuur Info -->
    <div class="pt-4 border-t">
        <h3 class="font-semibold text-gray-800 mb-2">Factuur</h3>
        <div v-if="factuur">
            <p class="text-gray-900 font-medium">{{ factuur.factuur_nr }}</p>
            <p class="text-sm text-gray-600">Datum: {{ new Date(factuur.datum).toLocaleDateString('nl-NL') }}</p>
        </div>
        <div v-else class="text-sm text-gray-500">No invoice associated.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { getTransactionById, getPartyById, getFactuurByTransactionId } from '../../api/mockApi';

const props = defineProps({
    transactionId: { type: String, required: true }
});

const transaction = ref(null);
const party = ref(null);
const factuur = ref(null);
const loading = ref(false);

watchEffect(async () => {
    if (!props.transactionId) return;
    loading.value = true;
    transaction.value = null;
    party.value = null;
    factuur.value = null;

    const t = await getTransactionById(props.transactionId);
    transaction.value = t;

    if (t) {
        if (t.party_id) {
            party.value = await getPartyById(t.party_id);
        }
        factuur.value = await getFactuurByTransactionId(t.id);
    }
    loading.value = false;
});

const formatCurrency = (value) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value);
</script>