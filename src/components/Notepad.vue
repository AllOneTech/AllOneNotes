<script setup lang="ts">
    import { useEditor, EditorContent } from '@tiptap/vue-3';
    import StarterKit from '@tiptap/starter-kit';

    const editor = useEditor({
        content: "<strong>I'm running Tiptap with Vue.js. 🎉</strong>",
        extensions: [StarterKit],
    })

</script>

<template>
    <section id="notebook">
        <div contenteditable ref="workspaceFieldEl" class="
            text-base min-h-screen w-[min(60%,_840px)] mx-auto my-12 px-9 py-16 bg-white rounded shadow-[0.1rem_0.1rem_0.3rem_0.3rem_#333]
        "> 
            <EditorContent :editor="editor" />
        </div>
    </section>
</template>

<style scoped>

</style>