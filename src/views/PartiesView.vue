<!-- src/views/PartiesView.vue -->
<template>
  <div>
    <div class="flex justify-between items-center">
        <h2 class="text-4xl font-semibold text-gray-700">Parties</h2>
        <BaseButton @click="showAddPartyModal = true">New Party</BaseButton>
    </div>
    <div class="mt-8 space-y-8">
      <div>
        <h3 class="text-xl font-semibold text-gray-600 mb-4">Debiteuren</h3>
        <AppTable :headers="headers" :items="debtors" @row-click="showPartyDetail" />
      </div>

      <div>
        <h3 class="text-xl font-semibold text-gray-600 mb-4">Crediteuren</h3>
        <AppTable :headers="headers" :items="creditors" @row-click="showPartyDetail" />
      </div>
    </div>
    
    <DetailSidebar :title="`Details: ${selectedParty?.name}`" :show="!!selectedParty" @close="selectedParty = null">
      <PartyDetail :party="selectedParty" />
    </DetailSidebar>

    <BaseModal :show="showAddPartyModal" @close="showAddPartyModal = false">
        <template #title>Add New Party</template>
        <template #body>
            <form id="add-party-form" @submit.prevent="handleAddNewParty" class="space-y-4">
                <input type="text" placeholder="Name" v-model="newParty.name" class="form-input" required>
                <input type="text" placeholder="Adres" v-model="newParty.adres" class="form-input" required>
                <input type="text" placeholder="IBAN" v-model="newParty.iban" class="form-input" required>
                <select v-model="newParty.type" class="form-input" required>
                    <option disabled value="">Select type...</option>
                    <option value="creditor">Creditor</option>
                    <option value="debtor">Debtor</option>
                </select>
            </form>
        </template>
        <template #footer>
            <BaseButton type="button" @click="showAddPartyModal = false" class="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</BaseButton>
            <BaseButton type="submit" form="add-party-form">Save Party</BaseButton>
        </template>
    </BaseModal>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { getParties, addParty } from '../api/mockApi';
import AppTable from '../components/common/AppTable.vue';
import DetailSidebar from '../components/common/DetailSidebar.vue';
import PartyDetail from '../components/specific/PartyDetail.vue';
import BaseModal from '../components/common/BaseModal.vue';
import BaseButton from '../components/common/BaseButton.vue';

const parties = ref([]);
const selectedParty = ref(null);
const showAddPartyModal = ref(false);
const newParty = reactive({ name: '', adres: '', iban: '', type: ''});

const headers = [
  { key: 'name', label: 'Naam' },
  { key: 'adres', label: 'Adres' },
  { key: 'iban', label: 'IBAN' },
];

const fetchParties = async () => {
    parties.value = await getParties();
}
onMounted(fetchParties);

const handleAddNewParty = async () => {
    await addParty(newParty);
    showAddPartyModal.value = false;
    Object.assign(newParty, { name: '', adres: '', iban: '', type: ''}); // Reset form
    await fetchParties();
};

const debtors = computed(() => parties.value.filter(p => p.type === 'debtor'));
const creditors = computed(() => parties.value.filter(p => p.type === 'creditor'));

const showPartyDetail = (party) => {
  selectedParty.value = party;
};
</script>

<style scoped>
.form-input {
  @apply block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
}
</style>