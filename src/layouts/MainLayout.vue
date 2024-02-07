<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Kiosk manager </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item
              clickable
              :to="menuItem.to"
              :active="menuItem.label === 'Outbox'"
              v-ripple
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';

const leftDrawerOpen: Ref<boolean> = ref(true);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const menuList = [
  {
    icon: 'sell',
    label: 'Transactions',
    separator: true,
    to: '/',
  },
  {
    icon: 'inventory_2',
    label: 'Manage Products',
    separator: true,
    to: 'products',
  },
  {
    icon: 'account_balance',
    label: 'Manage currencies',
    separator: true,
    to: '/manage-currencies',
  },
];
</script>
