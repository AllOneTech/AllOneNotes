<script setup lang="ts">
    import { defineEmits } from 'vue';

    const emits = defineEmits(['confirmSetFontSize']);

    /* FONT SIZE RANGE: 6 to 96 */
    const FONTSIZE_OPTIONS: number[] = [6, 8, 10, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96];

</script>

<template>
    <li v-for="option in FONTSIZE_OPTIONS" @click="emits('confirmSetFontSize', option)"
        class="py-1 bg-[#eeeb] text-sm font-medium text-[#222] text-center transition-colors border-[#222d] border-solid
            hover:cursor-pointer hover:bg-[#eeec] hover:font-bold hover:border-x-2
        "
    > 
        {{ option }} 
    </li>
</template>

<style scoped>

</style>