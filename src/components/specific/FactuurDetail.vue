<!-- src/components/specific/FactuurDetail.vue -->
<template>
  <div v-if="factuur" class="space-y-4">
    <div>
      <h4 class="text-sm font-medium text-gray-500">Factuurnummer</h4>
      <p class="mt-1 text-lg text-gray-900">{{ factuur.factuur_nr }}</p>
    </div>
    <div>
      <h4 class="text-sm font-medium text-gray-500">Datum</h4>
      <p class="mt-1 text-gray-900">{{ new Date(factuur.datum).toLocaleDateString('nl-NL') }}</p>
    </div>
    <div>
      <h4 class="text-sm font-medium text-gray-500">Type</h4>
      <p class="mt-1 text-gray-900 capitalize">{{ factuur.type }}</p>
    </div>

    <div class="flex items-center justify-between pt-4 border-t">
        <h3 class="text-md font-semibold text-gray-800">Actions</h3>
        <div class="flex items-center space-x-2">
            <button class="icon-button" title="Download PDF"><DownloadIcon /></button>
            
            <button v-if="!factuur.transaction_id" @click="showConnectModal = true" class="icon-button bg-green-100 text-green-700 hover:bg-green-200" title="Connect to Transaction">
                <LinkIcon />
            </button>
            
            <button @click="handleDelete" class="icon-button bg-red-100 text-red-700 hover:bg-red-200" title="Delete Factuur">
                <TrashIcon />
            </button>
        </div>
    </div>

    <!-- Connected Transaction Info -->
    <div v-if="factuur.transaction_id" class="pt-4 border-t">
        <h3 class="font-semibold text-gray-800 mb-2">Connected Transaction</h3>
        <div v-if="connectedTransaction">
             <p class="text-gray-900 font-medium">{{ connectedTransaction.omscrhijving }}</p>
             <p class="text-sm text-gray-600">{{ new Date(connectedTransaction.datum).toLocaleDateString('nl-NL') }} - {{ formatCurrency(connectedTransaction.bedrag) }}</p>
        </div>
        <div v-else>Loading transaction...</div>
    </div>
  </div>

  <!-- Connect Transaction Modal -->
  <BaseModal :show="showConnectModal" @close="showConnectModal = false">
      <template #title>Connect to a Transaction</template>
      <template #body>
          <div class="max-h-96 overflow-y-auto">
              <div v-if="allTransactions.length === 0">Loading transactions...</div>
              <ul v-else class="divide-y divide-gray-200">
                  <li v-for="t in allTransactions" :key="t.id" @click="handleConnect(t.id)" class="p-3 hover:bg-gray-100 cursor-pointer">
                      <p class="font-medium">{{ t.omscrhijving }}</p>
                      <p class="text-sm text-gray-600">{{ new Date(t.datum).toLocaleDateString() }} - {{ formatCurrency(t.bedrag) }}</p>
                  </li>
              </ul>
          </div>
      </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue';
import { deleteFactuur, getTransactions, connectFactuurToTransaction, getTransactionById } from '../../api/mockApi';
import DownloadIcon from '../../assets/icons/DownloadIcon.vue';
import LinkIcon from '../../assets/icons/LinkIcon.vue';
import TrashIcon from '../../assets/icons/TrashIcon.vue';
import BaseModal from '../common/BaseModal.vue';

const props = defineProps({ factuur: Object });
const emit = defineEmits(['deleted', 'updated']);

const showConnectModal = ref(false);
const allTransactions = ref([]);
const connectedTransaction = ref(null);

watch(showConnectModal, async (isShown) => {
    if (isShown && allTransactions.value.length === 0) {
        allTransactions.value = await getTransactions();
    }
});

watchEffect(async () => {
    if (props.factuur?.transaction_id) {
        connectedTransaction.value = await getTransactionById(props.factuur.transaction_id);
    } else {
        connectedTransaction.value = null;
    }
})

const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete factuur ${props.factuur.factuur_nr}?`)) {
        await deleteFactuur(props.factuur.id);
        emit('deleted', props.factuur.id);
    }
};

const handleConnect = async (transactionId) => {
    await connectFactuurToTransaction(props.factuur.id, transactionId);
    showConnectModal.value = false;
    emit('updated');
};

const formatCurrency = (value) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value);
</script>

<style scoped>
.icon-button {
    @apply p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors;
}
</style>