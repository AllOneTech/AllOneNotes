<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { elementDetailObj } from '../types/allTypes';
import LinkDialogBox from './dialog-boxes/LinkDialogBox.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

const dialogBoxElement = ref<null | HTMLElement>(null);

const emits = defineEmits(['handleAddLink', 'handleCloseDialogBox'])

const props = defineProps<{
    data: elementDetailObj
}>();

function closeDialogBox() { emits('handleCloseDialogBox') }
function addLink(urlText:  string) { emits('handleAddLink', urlText) }

onMounted(() => {
    if(!dialogBoxElement.value) return;
/*     const [topMargin, leftMargin] = [50, 0];
    dialogBoxElement.value.style.top = `${props.data.coords.y + topMargin}px`;
    dialogBoxElement.value.style.left = `${props.data.coords.x}px`; */
    
    dialogBoxElement.value.style.top = `0px`;
    dialogBoxElement.value.style.right = `0px`;
    /* console.log('pdn: ', props.data.name) */
})

</script>

<template>
    <div class="w-full min-h-screen fixed z-40 top-0 left-0"
        @click.self="closeDialogBox"
    >
        <section ref="dialogBoxElement" class="z-50 flex items-center justify-center fixed backdrop-blur-md bg-[hsla(200,75%,65%,0.75)] rounded p-8 min-w-[30vw] shadow-md border-l-2 border-b-2 border-solid border-[#222a]">
            <div class="absolute top-0 right-0 mt-9 mr-9">
                <FontAwesomeIcon :icon="faClose" class="text-3xl text-[#222a] hover:text-[#222d] hover:cursor-pointer" @click="closeDialogBox" />
            </div> 
            
            <!-- CONDITIONAL DIALOG BOXES -->
            <LinkDialogBox v-if="props.data.name === 'link'" @confirmAddLink="addLink" />
        </section>
    </div>
</template>

<style scoped>

</style>