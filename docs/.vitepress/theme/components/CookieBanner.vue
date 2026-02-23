<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const showBanner = ref(false)
const consentValue = ref(null)

// disable scrolling when the banner is shown
watch(showBanner, (isVisible) => {
  document.body.style.overflow = isVisible ? 'hidden' : ''
})

// helper to get a cookie by name
function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^|; )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

// helper to set a cookie for all subdomains (or localhost for testing)
function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  const domain = window.location.hostname.includes('localhost') ? '' : '.kitchenratio.com'
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/;${domain ? ` domain=${domain}` : ''}`
}

function initializeGA() {
  if (window.gtag) return

  const script = document.createElement('script')
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-T4SQXKGZK8'
  script.async = true
  document.head.appendChild(script)

  script.onload = () => {
    window.dataLayer = window.dataLayer || []
    window.gtag = function() { dataLayer.push(arguments) }

    window.gtag('js', new Date())
    window.gtag('config', 'G-T4SQXKGZK8')
  }
}

function isAmazonAffiliateUrl(urlString) {
  try {
    const url = new URL(urlString, window.location.origin)
    const host = url.hostname.toLowerCase()
    return /(^|\.)amzn\.to$/.test(host) || /(^|\.)amazon\./.test(host)
  } catch {
    return false
  }
}

function trackAffiliateClick(event) {
  const anchor = event.target?.closest?.('a[href]')
  if (!anchor) return
  const href = anchor.getAttribute('href') || ''
  if (!href || !isAmazonAffiliateUrl(href)) return
  if (typeof window.gtag !== 'function') return

  const absoluteUrl = new URL(href, window.location.origin).toString()
  const linkText = (anchor.textContent || '').trim().slice(0, 120)

  window.gtag('event', 'affiliate_click', {
    event_category: 'affiliate',
    event_label: absoluteUrl,
    affiliate_network: 'amazon',
    link_url: absoluteUrl,
    link_domain: new URL(absoluteUrl).hostname,
    link_text: linkText || 'affiliate_link',
  })
}

async function trackInternal() {
  // Hook for optional internal analytics when consent is declined.
}

function updateBannerFromConsent() {
  consentValue.value = getCookie('ga-consent')
  showBanner.value = !consentValue.value
}

function openCookiePreferences() {
  showBanner.value = true
}

onMounted(() => {
  updateBannerFromConsent()
  if (consentValue.value === 'accepted') {
    initializeGA()
  }
  window.addEventListener('open-cookie-preferences', openCookiePreferences)
  document.addEventListener('click', trackAffiliateClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('open-cookie-preferences', openCookiePreferences)
  document.removeEventListener('click', trackAffiliateClick)
  document.body.style.overflow = ''
})

function acceptCookies() {
  setCookie('ga-consent', 'accepted')
  showBanner.value = false
  consentValue.value = 'accepted'
  initializeGA()
}

async function declineCookies() {
  setCookie('ga-consent', 'declined')
  showBanner.value = false
  consentValue.value = 'declined'

  try {
    await trackInternal('cookie_decline', 'banner')
  } catch (error) {
    console.error('Tracking failed', error)
  }
}
</script>

<template>
  <div v-if="showBanner" class="cookie-overlay">
    <div class="cookie-banner">
      <p>
        This site uses cookies for analytics to improve your experience. See our
        <a href="/privacy-policy">Privacy Policy</a> and
        <a href="/cookie-policy">Cookie Policy</a>.
      </p>
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

.cookie-banner p {
  margin: 0;
}

.cookie-banner a {
  color: var(--vp-c-brand-1);
}

.button-container {
  display: flex;
  gap: 0.75rem;
  margin-left: 1rem;
}

.cookie-banner button {
  border-radius: 20px;
  padding: 0 20px;
  line-height: 38px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
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

@media (max-width: 768px) {
  .cookie-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .button-container {
    margin-left: 0;
  }
}
</style>
