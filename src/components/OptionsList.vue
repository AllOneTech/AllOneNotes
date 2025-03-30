<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { elementDetailObj } from '../types/allTypes';
import FontsizeOptionsList from './options-lists/FontsizeOptionsList.vue';
import FontfamilyOptionsList from './options-lists/FontfamilyOptionsList.vue';

const optionsListElement = ref<null | HTMLElement>(null);

const emits = defineEmits(['handleSetFontSize', 'handleSetFontFamily', 'handleCloseOptionsList'])

const props = defineProps<{
    data: elementDetailObj
}>();

function closeOptionList() { emits('handleCloseOptionsList'); }
function setFontSize(fontSize: number) { emits('handleSetFontSize', fontSize);  }
function setFontFamily(fontFamily: string) { emits('handleSetFontFamily', fontFamily); console.log('PICKED FONT Family: ', fontFamily); }

onMounted(() => {
    if(!optionsListElement.value) return;
    const [topMargin, leftMargin] = [0, 0];
    optionsListElement.value.style.top = `${props.data.coords.y + topMargin}px`;
    optionsListElement.value.style.left = `${props.data.coords.x}px`;
    optionsListElement.value.style.width = `${props.data.optional.targetWidth}px`;
})

</script>

<template>
    <div class="w-full min-h-screen fixed z-40 top-0 left-0"
        @click.self="closeOptionList"
    >
        <section ref="optionsListElement" class="absolute">
            <ul class="relative z-[60] border-2 border-[#222c] border-double border-t-none rounded-md">
                <!-- CONDITIONAL OPTIONS LISTS -->
                <FontsizeOptionsList v-if="props.data.name === 'fontsize'" @confirmSetFontSize="setFontSize" />
                <FontfamilyOptionsList v-else-if="props.data.name = 'fontfamily'" @confirmSetFontFamily="setFontFamily" />
            </ul>
        </section>
    </div>
</template>

<style scoped>

</style>