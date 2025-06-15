<!-- src/components/specific/BtwQuarterBox.vue -->
<template>
    <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">{{ title }}</h3>
        
        <table class="w-full text-sm text-left">
            <thead>
                <tr class="text-gray-500">
                    <th class="pb-2 font-medium">Type</th>
                    <th class="pb-2 font-medium text-right">Bedrag (Excl. BTW)</th>
                    <th class="pb-2 font-medium text-right">BTW</th>
                </tr>
            </thead>
            <tbody>
                <tr class="text-gray-900">
                    <td>Verkoop</td>
                    <td class="text-right">{{ formatCurrency(data.verkoop.bedrag) }}</td>
                    <td class="text-right">{{ formatCurrency(data.verkoop.btw) }}</td>
                </tr>
                <tr class="text-gray-900">
                    <td>Inkoop</td>
                    <td class="text-right">{{ formatCurrency(data.inkoop.bedrag) }}</td>
                    <td class="text-right">{{ formatCurrency(data.inkoop.btw) }}</td>
                </tr>
            </tbody>
        </table>

        <div class="mt-4 pt-4 border-t">
            <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-800">BTW te betalen:</span>
                <span class="text-lg font-bold" :class="data.btw_te_betalen >= 0 ? 'text-red-600' : 'text-green-600'">
                    {{ formatCurrency(data.btw_te_betalen) }}
                </span>
            </div>
            <p class="text-xs text-gray-500 mt-1 text-right">(Verkoop BTW - Inkoop BTW)</p>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: { type: String, required: true },
    data: { type: Object, required: true },
});

const formatCurrency = (value) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value);
</script>