<template>
  <footer class="site-footer">
    <p>{{ footerMessage }}</p>
    <p>{{ footerCopyright }}</p>
  </footer>
</template>

<script setup>
import { useData } from 'vitepress'

// Grab footer info from themeConfig dynamically
const { theme } = useData()
const footerMessage = theme.value?.footer?.message || ''
const footerCopyright = theme.value?.footer?.copyright || ''
</script>

<style>
.site-footer {
  padding: 2rem;
  text-align: center;
  color: #666;
  font-size: 14px;
  border-top: 1px solid #e5e5e5;
  margin-top: 2rem;
}
</style>