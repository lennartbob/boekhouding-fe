<!-- src/App.vue -->
<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    <Sidebar />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="container mx-auto px-6 py-8">
            <!-- This is where your page components will be rendered -->
            <!-- For this example, RekeningenView will be shown here by the router -->
            <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Sidebar from './components/layout/Sidebar.vue';
import { getOrganization } from './api/mockApi';

onMounted(async () => {
    const organization = await getOrganization();
    if (organization) {
        // 3) Update browser title and favicon
        document.title = `${organization.name} - Boekhouding`;

        const favicon = document.querySelector("link[rel~='icon']");
        if (favicon && organization.logoUrl) {
            favicon.href = organization.logoUrl;
        }
    }
});
</script>

<style>
/* You can add global styles here or in a separate CSS file */
body {
  margin: 0;
}
</style>