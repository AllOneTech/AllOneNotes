<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { availableDialogBoxNames, dialogBoxDetailsObj } from '@/types/allTypes';
import LinkDialogBox from './dialog-boxes/LinkDialogBox.vue';

const dialogBoxElement = ref<null | HTMLElement>(null);

const props = defineProps<{
    data: dialogBoxDetailsObj
}>();

onMounted(() => {
    if(!dialogBoxElement.value) return;
/*     const [topMargin, leftMargin] = [50, 0];
    dialogBoxElement.value.style.top = `${props.data.coords.y + topMargin}px`;
    dialogBoxElement.value.style.left = `${props.data.coords.x}px`; */
    
    dialogBoxElement.value.style.top = `0px`;
    dialogBoxElement.value.style.right = `0px`;

})

</script>

<template>
    <section ref="dialogBoxElement" class="z-50 flex items-center justify-center absolute bg-[hsl(208,50%,80%)] rounded p-8 w-[30vw] border-2 border-solid border-black">
        <LinkDialogBox v-if="props.data.name === 'link'" />
    </section>
</template>

<style scoped>

</style>