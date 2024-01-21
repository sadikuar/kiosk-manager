<template>
  <q-layout view="lHh lpR lFf">
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- TODO -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const leftDrawerOpen = ref(true);
</script>
