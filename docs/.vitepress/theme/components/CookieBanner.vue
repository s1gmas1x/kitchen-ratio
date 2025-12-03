<script setup>
import { ref, onMounted } from "vue";

const showBanner = ref(false);

function initializeGA() {
  if (window.gtag) return // already initialized

  // load the GA script
  const script = document.createElement('script')
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-T4SQXKGZK8'
  script.async = true
  document.head.appendChild(script)

  // setup gtag after the script loads
  script.onload = () => {
    window.dataLayer = window.dataLayer || []
    window.gtag = function() { dataLayer.push(arguments) }

    window.gtag('js', new Date())
    window.gtag('config', 'G-T4SQXKGZK8')
  }
}

async function trackInternal() {
  // optional: do nothing or console.log
  console.log("User declined cookies")
}

onMounted(() => {
  const consent = localStorage.getItem("ga-consent");
  if (!consent) {
    showBanner.value = true;
  } else if (consent === "accepted") {
    initializeGA();
  }
});

function acceptCookies() {
  localStorage.setItem("ga-consent", "accepted");
  showBanner.value = false;
  initializeGA();
}

async function declineCookies() {
  localStorage.setItem("ga-consent", "declined");
  showBanner.value = false;

  try {
    await trackInternal("cookie_decline", "banner");
  } catch (error) {
    console.error("Tracking failed", error);
  }
}
</script>

<template>
  <div v-if="showBanner" class="cookie-overlay">
    <div class="cookie-banner">
      <p>This site uses cookies for analytics to improve your experience.</p>
      <div class="button-container">
        <button class="primary" @click="acceptCookies">Accept</button>
        <button class="alt" @click="declineCookies">Decline</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cookie-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 9998;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.cookie-banner {
  width: 100%;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-top: 1px solid var(--vp-c-divider);
  padding: 1rem 1.5rem;
  z-index: 9999;
  font-size: 0.95rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-container {
  display: flex;
  gap: 0.75rem;
}

.cookie-banner button {
    border-radius: 20px;
    padding: 0 20px;
    line-height: 38px;
    font-size: 14px;
}

/* Brand button – matches VitePress 'brand' theme button */
.cookie-banner button.primary {
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  border: var(--vp-button-brand-border);
}

.cookie-banner button.primary:hover {
  background: var(--vp-button-brand-hover-bg);
  color: var(--vp-button-brand-hover-text);
}

.cookie-banner button.primary:active {
  background: var(--vp-button-brand-active-bg);
  color: var(--vp-button-brand-active-text);
}

/* Alt button – matches VitePress 'alt' theme button */
.cookie-banner button.alt {
  background: var(--vp-button-alt-bg);
  color: var(--vp-button-alt-text);
  border: var(--vp-button-alt-border);
}

.cookie-banner button.alt:hover {
  background: var(--vp-button-alt-hover-bg);
  color: var(--vp-button-alt-hover-text);
}

.cookie-banner button.alt:active {
  background: var(--vp-button-alt-active-bg);
  color: var(--vp-button-alt-active-text);
}
</style>