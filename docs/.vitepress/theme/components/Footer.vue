<template>
  <footer class="site-footer">
    <div class="footer-text">
      <p>As an Amazon Associate I earn from qualifying purchases.</p>
      <p>© 2025 KitchenRatio</p>
        <!-- PayPal Donate Button -->
      <ClientOnly>
        <div id="donate-button-container">
          <p>Donate to support KitchenRatio:</p>
          <div id="donate-button"></div>
        </div>
      </ClientOnly>

    </div>

  </footer>
</template>

<script setup>
import { useData } from 'vitepress'
import { onMounted } from 'vue'

// Grab footer info from themeConfig dynamically
const { theme } = useData()
const footerMessage = theme.value?.footer?.message || ''
const footerCopyright = theme.value?.footer?.copyright || ''

onMounted(() => {
  // Load PayPal SDK dynamically
  const existing = document.getElementById('paypal-donation-sdk')
  if (!existing) {
    const script = document.createElement('script')
    script.id = 'paypal-donation-sdk'
    script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js'
    script.charset = 'UTF-8'
    script.onload = renderButton
    document.body.appendChild(script)
  } else {
    renderButton()
  }

  function renderButton() {
    if (!window.PayPal) return

    window.PayPal.Donation.Button({
      env: 'production',
      hosted_button_id: 'TFRBMDXK79LLQ',
      image: {
        src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif',
        alt: 'Donate with PayPal button',
        title: 'PayPal - The safer, easier way to pay online!'
      }
    }).render('#donate-button')
  }
})
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
/* PayPal Button container */
#donate-button-container {
  margin-top: 1rem;
  text-align: left;
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
  #donate-button-container {
    justify-items: center;
  }
}
</style>