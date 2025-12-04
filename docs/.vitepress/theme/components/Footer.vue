<template>
  <footer class="site-footer">
    <div class="footer-text">
      <p>{{ footerMessage }}</p>
      <p>{{ footerCopyright }}</p>
    </div>

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
  width: 100%;
  padding: 2rem 0;
  margin-top: 2rem;
  background: var(--vp-c-bg);
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  font-size: 14px;
}

/* The inner container holds the footer text and constrains width like main content */
.footer-text {
  
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
  text-align: left;
  line-height: 1.4;
}

/* When the sidebar is visible on normal desktop sizes, push the text by the sidebar width */
@media (min-width: 960px) and (max-width: 1439px) {
  .footer-text {
    /* simple shift: aligns with the content column when viewport <= layout max */
    padding-left: calc(var(--vp-sidebar-width) + 2rem);
  }
}

/* On very wide viewports, the content area is centered; match the layout's calculated padding */
@media (min-width: 1440px) {
  .footer-text {
    /* mirror the VPContent.has-sidebar rule you inspected */
    padding-left: calc((100% - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width) + 2rem);
    padding-right: calc((100% - var(--vp-layout-max-width)) / 2 + 1rem);
  }
}

/* Mobile/tablet: center the text */
@media (max-width: 959px) {
  .footer-text {
    padding-left: 1rem;
    padding-right: 1rem;
    text-align: center;
  }
}
</style>