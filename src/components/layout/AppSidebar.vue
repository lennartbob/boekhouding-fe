<!-- src/components/layout/AppSidebar.vue -->
<template>
  <div class="flex flex-col w-64 bg-gray-800 text-white">
    <!-- ... nav links for Dashboard, Facturen, Parties ... -->
    <div class="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        <router-link to="/" class="nav-link">Dashboard</router-link>
        <router-link to="/facturen" class="nav-link">Facturen</router-link>
        <router-link to="/parties" class="nav-link">Parties</router-link>
        
        <div class="pt-4 mt-4 border-t border-gray-700">
            <div class="flex justify-between items-center px-2">
                 <h2 class="text-xs font-semibold tracking-wider text-gray-400 uppercase">Rekeningen</h2>
                 <button @click="showAddRekeningModal = true" class="text-gray-400 hover:text-white" title="Add Rekening">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                 </button>
            </div>
            <div v-if="rekeningen.length" class="mt-2 space-y-1">
            <router-link
                v-for="rekening in rekeningen"
                :key="rekening.id"
                :to="`/rekeningen/${rekening.id}`"
                class="nav-link"
            >
                {{ rekening.name }}
            </router-link>
            </div>
            <div v-else class="px-2 text-gray-400 text-sm">Loading...</div>
        </div>
    </div>
  </div>

  <BaseModal :show="showAddRekeningModal" @close="showAddRekeningModal = false">
      <template #title>Nieuwe Rekening Toevoegen</template>
      <template #body>
          <form @submit.prevent="handleAddNewRekening" class="space-y-4">
              <div>
                  <label for="rekening-name" class="block text-sm font-medium text-gray-700">Naam</label>
                  <input type="text" v-model="newRekening.name" id="rekening-name" class="form-input" required>
              </div>
              <div>
                  <label for="rekening-iban" class="block text-sm font-medium text-gray-700">IBAN</label>
                  <input type="text" v-model="newRekening.iban" id="rekening-iban" class="form-input" required>
              </div>
              <div>
                  <label for="rekening-saldo" class="block text-sm font-medium text-gray-700">Start Saldo</label>
                  <input type="number" step="0.01" v-model.number="newRekening.saldo" id="rekening-saldo" class="form-input" required>
              </div>
          </form>
      </template>
      <template #footer>
          <BaseButton type="button" @click="showAddRekeningModal = false" class="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</BaseButton>
          <BaseButton @click="handleAddNewRekening">Save Rekening</BaseButton>
      </template>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { getRekeningen, addRekening } from '../../api/mockApi';
import BaseModal from '../common/BaseModal.vue';
import BaseButton from '../common/BaseButton.vue';

const rekeningen = ref([]);
const showAddRekeningModal = ref(false);
const newRekening = reactive({ name: '', iban: '', saldo: 0 });

const fetchRekeningen = async () => {
    rekeningen.value = await getRekeningen();
};

const handleAddNewRekening = async () => {
    if (!newRekening.name || !newRekening.iban) return;
    await addRekening(newRekening);
    showAddRekeningModal.value = false;
    // Reset form
    Object.assign(newRekening, { name: '', iban: '', saldo: 0 });
    // Refresh the list in the sidebar
    await fetchRekeningen();
};

onMounted(fetchRekeningen);
</script>

<style scoped>
.nav-link { @apply block px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700; }
.router-link-exact-active { @apply bg-gray-900; }
.form-input { @apply mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm; }
</style>