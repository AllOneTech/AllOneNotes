<script setup lang="ts">
    import { defineEmits } from 'vue';
    import type { fontFamilyOptionsObj } from '@/types/allTypes';

    const emits = defineEmits(['confirmSetFontFamily']);

    /* LIST OF SUPPORTED FONT FAMILIES */
    const FONTFAMILY_OPTIONS: fontFamilyOptionsObj[] = [
        { name: 'Pacifico',  sourceURL: 'https://fonts.gstatic.com/s/pacifico/v21/FwZY7-Qmy14u9lezJ-6H6MmBp0u-.woff2', isAlreadyLoaded: false },
        { name: 'Plus Jakarta Sans', sourceURL: '', isAlreadyLoaded: true },
        { name: 'Inter', sourceURL: '', isAlreadyLoaded: true }, 
        { name: 'Comic Sans MS', sourceURL: '', isAlreadyLoaded: true },
        { name: 'serif', sourceURL: '', isAlreadyLoaded: true },
        { name: 'monospace', sourceURL: '', isAlreadyLoaded: true },
        { name: 'cursive', sourceURL: '', isAlreadyLoaded: true }
    ];

    async function loadFont(theFont: fontFamilyOptionsObj) {
        if(theFont.isAlreadyLoaded) { updateFontFamily(theFont); return; }

        const font = new FontFace(theFont.name, `url(${theFont.sourceURL})`);
        await font.load();
        document.fonts.add(font);
        updateFontFamily(theFont);
    }

    const updateFontFamily = (theFont: fontFamilyOptionsObj) => { 
        theFont.isAlreadyLoaded = true;
        emits('confirmSetFontFamily', theFont.name); 
    }

</script>

<template>
    <li v-for="option in FONTFAMILY_OPTIONS" @click="loadFont(option)"
        class="py-1 px-2 truncate w-full bg-[#eeeb] text-sm font-medium text-[#222] text-center transition-colors border-[#222d] border-solid
            hover:cursor-pointer hover:bg-[#eeec] hover:font-bold hover:border-x-2
        "
    > 
        {{ option.name }} 
    </li>
</template>

<style scoped>

</style>