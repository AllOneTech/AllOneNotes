<script setup lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

    import { faBold, faCloud, faDownload, faFile, faItalic, faPaintBrush, faPencil, faUnderline } from '@fortawesome/free-solid-svg-icons';

</script>

<template>
    <div class="grid grid-rows-1 grid-cols-[1fr_2fr_1fr] py-6 px-8 w-full h-full bg-[#ADE4FF] overflow-auto border-b-4 border-solid border-b-[#93C2D9]">
        <section id="toolset-documentinfo" class="grid grid-rows-[auto_auto] grid-cols-[auto_auto] place-content-start gap-x-6">
            <FontAwesomeIcon :icon="faFile" class="text-6xl text-[hsl(222,_40%,_40%)] row-start-1 row-span-2 drop-shadow-[0.1rem_0.1rem_0.1rem_hsl(222,_60%,_60%)] _documentIcon" />
            <div class="flex items-center gap-5">
                <p class="document-title text-2xl my-1"> My Document </p>
                <FontAwesomeIcon :icon="faPencil" class="text-base text-[#333]" @click="" />
            </div>
            
            <span class="document-description row-start-2 col-start-2"> Last modified: Today </span>
        </section>

        <div class="toolset-toolcontainer">
            <div class="flex items-center justify-center w-6 h-6 p-4 bg-[hsl(207,_80%,_80%)] rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222,_0_0_0.2rem_#444]
                    transition-colors hover:cursor-pointer hover:bg-[hsl(207,_90%,_70%)]
                "
                @click=""
            > 
                <FontAwesomeIcon :icon="faBold" class="text-base text-[#333] drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)]" @click="" />
            </div>

            <div class="flex items-center justify-center w-6 h-6 p-4 bg-[hsl(207,_80%,_80%)] rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222,_0_0_0.2rem_#444]
                    transition-colors hover:cursor-pointer hover:bg-[hsl(207,_90%,_70%)]
                "
            >
                <FontAwesomeIcon :icon="faItalic" class="text-base text-[#333] drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)]" @click="" />
            </div>

            <div class="flex items-center justify-center w-6 h-6 p-4 bg-[hsl(207,_80%,_80%)] rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222,_0_0_0.2rem_#444]
                    transition-colors hover:cursor-pointer hover:bg-[hsl(207,_90%,_70%)]
                "
            >
                <FontAwesomeIcon :icon="faUnderline" class="text-base text-[#333] drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)]" @click="" />
            </div>

            <div class="flex items-center justify-center w-6 h-6 p-4 bg-[hsl(207,_80%,_80%)] rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222,_0_0_0.2rem_#444]
                    transition-colors hover:cursor-pointer hover:bg-[hsl(207,_90%,_70%)]
                "
            >
                <FontAwesomeIcon :icon="faPaintBrush" class="text-base text-[#333] drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)]" @click="" />
            </div>

            <div class="flex items-center justify-center w-6 h-6 p-4 bg-[hsl(207,_80%,_80%)] rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222,_0_0_0.2rem_#444]
                    transition-colors hover:cursor-pointer hover:bg-[hsl(122,_50%,_70%)]
                " 
                onclick="downloadtxt()"
            >
                <FontAwesomeIcon :icon="faDownload" class="text-base text-[#333] drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)]" @click="" />
            </div>

            <div class="flex items-center justify-center w-6 h-6 p-4 bg-[hsl(207,_80%,_80%)] rounded border-2 border-solid border-[#222b] shadow-[inset_-0.05rem_-0.05rem_0.1rem_#222,_0_0_0.2rem_#444]
                    transition-colors hover:cursor-pointer hover:bg-[hsl(122,_50%,_70%)]
                " 
                onclick="importTxtFile()"
            >
                <FontAwesomeIcon :icon="faCloud" class="text-base text-[#333] drop-shadow-[0rem_0rem_0.1rem_hsl(207,_90%,_70%)]" @click="" />
            </div>

        </div>

        <div></div>
    </div>
</template>

<style scoped>

    .document-description {
        grid-row: 2; /* Do not remove this - as Tailwind alternative seems not to work */
        grid-column: 2; /* Do not remove this - as Tailwind alternative seems not to work */
    }

</style>