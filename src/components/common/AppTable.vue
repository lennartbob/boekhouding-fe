<!-- src/components/common/AppTable.vue -->
<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow">
    <table class="min-w-full whitespace-nowrap">
      <thead class="bg-gray-50">
        <tr>
          <th v-for="header in headers" :key="header.key" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="!items.length">
          <td :colspan="headers.length" class="px-6 py-4 text-center text-gray-500">
            No data available.
          </td>
        </tr>
        <tr v-for="item in items" :key="item.id" @click="$emit('rowClick', item)" class="hover:bg-gray-50 cursor-pointer">
          <td v-for="header in headers" :key="header.key" class="px-6 py-4">
            <slot :name="`cell(${header.key})`" :value="item[header.key]" :item="item">
              {{ item[header.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  headers: {
    type: Array,
    required: true, // e.g., [{ key: 'name', label: 'Name' }]
  },
  items: {
    type: Array,
    required: true,
  },
});

defineEmits(['rowClick']);
</script>