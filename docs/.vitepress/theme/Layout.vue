<script setup>
import DefaultTheme from 'vitepress/theme'
import Footer from './components/Footer.vue'
import { useRoute } from 'vitepress'

const { Layout } = DefaultTheme
const route = useRoute()
</script>

<template>
  <Layout>
    <slot />
    <!-- Show footer on all pages except homepage -->
    <Footer v-if="route.path !== '/'" />
  </Layout>
</template>