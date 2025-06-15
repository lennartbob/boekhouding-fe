<!-- src/components/common/UserProfile.vue -->
<template>
    <div v-if="user" class="flex items-center">
        <img :src="user.avatarUrl" alt="User Avatar" class="h-10 w-10 rounded-full object-cover mr-3">
        <div>
            <p class="font-semibold text-sm">{{ user.name }}</p>
            <p class="text-xs text-gray-400">{{ user.email }}</p>
        </div>
    </div>
    <div v-else class="text-center text-gray-400 text-sm">
        Loading user...
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUser } from '../../api/mockApi';

const user = ref(null);

onMounted(async () => {
    user.value = await getUser();
});
</script>