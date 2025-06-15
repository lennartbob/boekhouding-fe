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
            <h4 class="text-sm font-medium text-gray-500">Bedrag (Excl. BTW)</h4>
            <p class="mt-1 text-gray-900" :class="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrency(transaction.bedrag) }}
            </p>
        </div>
        <div>
            <h4 class="text-sm font-medium text-gray-500">Datum</h4>
            <p class="mt-1 text-gray-900">{{ new Date(transaction.datum).toLocaleDateString('nl-NL') }}</p>
        </div>
    </div>

    <!-- Actions -->
    <div class="pt-4 border-t">
        <h3 class="font-semibold text-gray-800 mb-2">Actions</h3>
        <div class="flex items-center space-x-4">
            <!-- Status Change -->
            <div class="flex items-center space-x-2">
                <PencilIcon class="text-gray-500" />
                <select v-model="transaction.status" @change="handleStatusChange" class="form-input text-sm py-1.5">
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="PAID">Paid</option>
                </select>
            </div>
            <!-- Delete Button -->
            <button @click="handleDelete" class="icon-button bg-red-100 text-red-700 hover:bg-red-200" title="Delete Transaction">
                <TrashIcon />
            </button>
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
import { getTransactionById, getPartyById, getFactuurByTransactionId, setTransactionStatus, deleteTransaction } from '../../api/mockApi';
import TrashIcon from '../../assets/icons/TrashIcon.vue';
import PencilIcon from '../../assets/icons/PencilIcon.vue';

const props = defineProps({
    transactionId: { type: String, required: true }
});

const emit = defineEmits(['deleted', 'updated']);

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

const handleStatusChange = async () => {
    if (!transaction.value) return;
    await setTransactionStatus(transaction.value.id, transaction.value.status);
    emit('updated');
};

const handleDelete = async () => {
    if (!transaction.value) return;
    if (window.confirm(`Are you sure you want to delete this transaction: "${transaction.value.omscrhijving}"?`)) {
        await deleteTransaction(transaction.value.id);
        emit('deleted', transaction.value.id);
    }
};


const formatCurrency = (value) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value);
</script>

<style scoped>
.icon-button {
    @apply p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors;
}
.form-input {
  @apply block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
}
</style>