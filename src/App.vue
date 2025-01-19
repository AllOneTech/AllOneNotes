<script setup lang="ts">
  import Notepad from './components/Notepad.vue';
  import Navbar from './components/Navbar.vue';

</script>

<template>
  <header class="sticky top-0">
    <Navbar />
  </header>

  <main>
      <Notepad />
  </main>
</template>

<style scoped>

</style>
