<template>
  <div
    v-if="tipSuccess"
    class="tip-toast tip-toast-success"
    role="status"
    aria-live="polite"
  >
    Thanks for supporting KitchenRatio. Your tip went through.
  </div>

  <div
    v-if="tipCanceled"
    class="tip-toast tip-toast-cancel"
    role="status"
    aria-live="polite"
  >
    Tip canceled. No worries! Glad you stopped by, and thanks for checking out KitchenRatio.
  </div>

  <footer class="site-footer" :class="{ 'site-footer--with-sidebar': hasSidebar }">
    <div class="footer-text">
      <p class="footer-kicker">Built for dough formulas, hydration control, and repeatable scaling.</p>
      <p class="footer-legal-links">
        <a href="https://kitchenratio.com/privacy-policy.html">Privacy Policy</a>
        <span aria-hidden="true">·</span>
        <a href="https://kitchenratio.com/cookie-policy.html">Cookie Policy</a>
        <span aria-hidden="true">·</span>
        <button type="button" class="footer-link-button" @click="openCookiePreferences">
          Cookie Preferences
        </button>
      </p>

      <div id="tip-button-container">
        <div class="tip-copy">
          <div class="tip-eyebrow">Support updates</div>
          <h3 class="tip-heading">Help keep KitchenRatio online</h3>
          <p class="tip-description">
            If the docs or calculator help your workflow, a tip supports ongoing development and helps keep the tool ad free.
          </p>
        </div>

        <div class="tip-button-row">
          <button
            v-for="amountCents in tipPresetsCents"
            :key="amountCents"
            type="button"
            class="tip-button tip-button-primary"
            :disabled="tipLoading || tipOptionsLoading"
            @click="startTip(amountCents)"
          >
            {{ tipLoading ? 'Opening…' : formatTipAmount(amountCents) }}
          </button>

          <div class="tip-custom-anchor">
            <div v-if="showCustomTipBox" class="tip-custom-popup">
              <input
                v-model="customTipDollars"
                type="text"
                inputmode="decimal"
                @input="handleCustomTipInput"
                class="tip-input"
                :min="customMinDollars"
                :max="customMaxDollars"
                step="0.01"
                :placeholder="`$${customMinDollars}-$${customMaxDollars}`"
              >
              <button
                type="button"
                class="tip-button tip-button-secondary"
                :disabled="tipLoading || tipOptionsLoading"
                @click="startCustomTip"
              >
                {{ customTipCheckoutLabel }}
              </button>
              <button
                type="button"
                class="tip-button"
                :disabled="tipLoading"
                @click="showCustomTipBox = false"
              >
                Cancel
              </button>
            </div>

            <button
              type="button"
              class="tip-button tip-button-secondary"
              :disabled="tipLoading || tipOptionsLoading"
              @click="toggleCustomTipBox"
            >
              Custom tip
            </button>
          </div>
        </div>

        <p v-if="tipSuccess" class="tip-message tip-message-success">
          Thanks for supporting KitchenRatio. Your tip went through.
        </p>

        <p v-if="tipError" class="tip-message tip-message-error">
          {{ tipError }}
        </p>

        <p class="tip-note">
          Checkout is handled by Stripe on a secure hosted page. Payment details are not entered into KitchenRatio directly.
        </p>
      </div>

      <p class="footer-affiliate">As an Amazon Associate I earn from qualifying purchases.</p>
      <p class="footer-copyright">© 2025-{{ year }} KitchenRatio. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { useData, useRoute } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const year = new Date().getFullYear()
const route = useRoute()
const { page } = useData()

const tipLoading = ref(false)
const tipError = ref('')
const tipSuccess = ref(false)
const tipCanceled = ref(false)
const tipOptionsLoading = ref(false)
const customTipDollars = ref('')
const showCustomTipBox = ref(false)
const tipPresetsCents = ref([200, 500])
const tipCustomMinCents = ref(100)
const tipCustomMaxCents = ref(5000)
const hardCustomMaxCents = 5000

const tipCanceledMessage = 'Tip canceled. No worries! Glad you stopped by, and thanks for checking out KitchenRatio.'
const tipTenantKey = 'kitchenratio'
let tipSuccessTimer = null
let tipCanceledTimer = null

const customMinDollars = computed(() => (tipCustomMinCents.value / 100).toFixed(2))
const effectiveCustomMaxCents = computed(() => Math.min(tipCustomMaxCents.value, hardCustomMaxCents))
const customMaxDollars = computed(() => (effectiveCustomMaxCents.value / 100).toFixed(2))
const hasSidebar = computed(() => {
  if (page.value?.isNotFound) return false
  if (page.value?.frontmatter?.sidebar === false) return false
  return (
    route.path.startsWith('/guides/') ||
    route.path.startsWith('/recipes/') ||
    route.path.startsWith('/ingredients/')
  )
})
const customTipCheckoutLabel = computed(() => {
  const amount = Number(customTipDollars.value)
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Checkout'
  }
  return `Checkout $${amount.toFixed(2)}`
})

function clearTipTimers() {
  if (tipSuccessTimer) {
    window.clearTimeout(tipSuccessTimer)
    tipSuccessTimer = null
  }

  if (tipCanceledTimer) {
    window.clearTimeout(tipCanceledTimer)
    tipCanceledTimer = null
  }
}

function showTipSuccess() {
  tipSuccess.value = true
  tipCanceled.value = false

  if (tipSuccessTimer) {
    window.clearTimeout(tipSuccessTimer)
  }

  tipSuccessTimer = window.setTimeout(() => {
    tipSuccess.value = false
    tipSuccessTimer = null
  }, 6000)
}

function showTipCanceled() {
  tipCanceled.value = true
  tipError.value = tipCanceledMessage
  tipSuccess.value = false

  if (tipCanceledTimer) {
    window.clearTimeout(tipCanceledTimer)
  }

  tipCanceledTimer = window.setTimeout(() => {
    tipCanceled.value = false
    if (tipError.value === tipCanceledMessage) {
      tipError.value = ''
    }
    tipCanceledTimer = null
  }, 6000)
}

function processTipReturn() {
  const params = new URLSearchParams(window.location.search)
  const tipState = params.get('tip')

  if (tipState === 'success') {
    showTipSuccess()
  } else if (tipState === 'cancel') {
    showTipCanceled()
  } else {
    return
  }

  params.delete('tip')
  const query = params.toString()
  const hash = window.location.hash || ''
  const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ''}${hash}`
  window.history.replaceState({}, '', cleanUrl)
}

function formatTipAmount(amountCents) {
  const amount = amountCents / 100
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`
}

const configuredApiOrigin = String(import.meta.env.VITE_API_ORIGIN ?? '').replace(/\/+$/, '')

function getApiOrigin() {
  if (configuredApiOrigin) return configuredApiOrigin

  return window.location.hostname === 'localhost'
    ? 'http://localhost'
    : 'https://api.ckohl.com'
}

async function loadTipOptions() {
  tipOptionsLoading.value = true

  try {
    const res = await fetch(`${getApiOrigin()}/api/billing/tip-options`, {
      headers: {
        Accept: 'application/json',
        'X-Tenant': tipTenantKey,
      },
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.message || `Unable to load tip options (${res.status})`)
    }

    if (Array.isArray(data?.presets_cents) && data.presets_cents.length > 0) {
      tipPresetsCents.value = data.presets_cents
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0)
    }

    const minCents = Number(data?.custom_min_cents)
    const maxCents = Number(data?.custom_max_cents)
    if (Number.isInteger(minCents) && minCents > 0) {
      tipCustomMinCents.value = minCents
    }
    if (Number.isInteger(maxCents) && maxCents >= tipCustomMinCents.value) {
      tipCustomMaxCents.value = maxCents
    }
  } catch (error) {
    tipError.value = error?.message || 'Unable to load tip options.'
  } finally {
    tipOptionsLoading.value = false
  }
}

function startCustomTip() {
  const amount = Number(customTipDollars.value)
  const amountCents = Math.round(amount * 100)

  if (!Number.isFinite(amount) || amount <= 0) {
    tipError.value = 'Enter a valid custom tip amount.'
    return
  }

  if (amountCents < tipCustomMinCents.value || amountCents > effectiveCustomMaxCents.value) {
    tipError.value = `Custom tip must be between $${customMinDollars.value} and $${customMaxDollars.value}.`
    return
  }

  showCustomTipBox.value = false
  startTip(amountCents)
}

function toggleCustomTipBox() {
  tipError.value = ''
  showCustomTipBox.value = !showCustomTipBox.value
}

function handleCustomTipInput(event) {
  const sourceValue = String(event?.target?.value ?? customTipDollars.value ?? '')
  let rawValue = sourceValue.replace(/[^\d.]/g, '')

  const firstDotIndex = rawValue.indexOf('.')
  if (firstDotIndex !== -1) {
    rawValue = rawValue.slice(0, firstDotIndex + 1) + rawValue.slice(firstDotIndex + 1).replace(/\./g, '')
  }

  if (rawValue === '') {
    customTipDollars.value = ''
    return
  }

  const hasDot = rawValue.includes('.')
  let [integerPart, decimalPart = ''] = rawValue.split('.')

  integerPart = integerPart.replace(/^0+(?=\d)/, '')
  decimalPart = decimalPart.slice(0, 2)

  let normalizedValue = hasDot
    ? `${integerPart || '0'}.${decimalPart}`
    : (integerPart || '0')

  const numericValue = Number(normalizedValue)
  const maxValue = Number(customMaxDollars.value)

  if (Number.isFinite(numericValue) && numericValue > maxValue) {
    normalizedValue = maxValue.toFixed(2)
  }

  customTipDollars.value = normalizedValue
}

async function startTip(amountCents = 500) {
  tipError.value = ''
  tipSuccess.value = false
  tipCanceled.value = false
  tipLoading.value = true

  try {
    const apiOrigin = getApiOrigin()

    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
    const successUrl = `${window.location.origin}${currentPath}?tip=success`
    const cancelUrl = `${window.location.origin}${currentPath}?tip=cancel`

    const res = await fetch(`${apiOrigin}/api/billing/checkout-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Tenant': tipTenantKey,
      },
      body: JSON.stringify({
        amount_cents: amountCents,
        currency: 'USD',
        success_url: successUrl,
        cancel_url: cancelUrl,
        description: 'KitchenRatio tip',
        metadata: { source: 'docs_footer' },
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.message || `Request failed (${res.status})`)
    }

    if (!data.checkout_url) {
      throw new Error('No checkout_url returned from API.')
    }

    window.location.href = data.checkout_url
  } catch (error) {
    tipError.value = error?.message || 'Unable to start tip checkout.'
  } finally {
    tipLoading.value = false
  }
}

onMounted(async () => {
  await nextTick()
  loadTipOptions()
  processTipReturn()
})

watch(
  () => route.path,
  async () => {
    await nextTick()
    processTipReturn()
  }
)

onBeforeUnmount(() => {
  clearTipTimers()
})

function openCookiePreferences() {
  window.dispatchEvent(new Event('open-cookie-preferences'))
}
</script>

<style>
.site-footer {
  width: 100%;
  padding: 2.4rem 0 2.6rem;
  margin-top: 2.5rem;
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--calc-bg) 84%, transparent) 0%,
      color-mix(in srgb, var(--calc-bg-elv) 96%, transparent) 100%
    );
  border-top: 1px solid var(--calc-card-reference-border);
  color: var(--vp-c-text-1);
  font-size: 13px;
}

.footer-text {
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
  text-align: left;
  line-height: 1.55;
}

.footer-text p {
  margin: 0 0 0.75rem;
}

.footer-kicker {
  margin-bottom: 0.45rem;
  color: var(--calc-text-2);
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.45;
}

.site-footer:not(.site-footer--with-sidebar) .footer-text {
  max-width: var(--vp-layout-max-width);
}

.footer-legal-links {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.footer-legal-links a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 0.16em;
}

.footer-link-button {
  border: 0;
  background: none;
  color: var(--vp-c-brand-1);
  padding: 0;
  cursor: pointer;
  font: inherit;
  text-decoration: underline;
}

#tip-button-container {
  margin-top: 0.95rem;
  padding: 0.95rem 1.05rem 1rem;
  border: 1px solid var(--calc-card-reference-border);
  border-bottom-width: 2px;
  border-radius: 1rem;
  background: var(--calc-card-reference-bg);
  box-shadow: var(--calc-card-reference-shadow);
  text-align: left;
}

.tip-copy {
  display: grid;
  gap: 0.2rem;
}

.tip-eyebrow {
  color: var(--calc-text-3);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.tip-heading {
  margin: 0;
  font-family: var(--kr-font-display);
  font-size: 1.16rem;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--calc-text-1);
}

.tip-description {
  margin-bottom: 0;
  color: var(--calc-text-2);
  font-size: 0.88rem;
  line-height: 1.5;
}

.tip-button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.8rem;
}

.tip-button {
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.tip-custom-anchor {
  position: relative;
  display: inline-block;
  margin-left: 0.5rem;
}

.tip-custom-popup {
  position: absolute;
  left: 0;
  bottom: calc(100% + 0.5rem);
  z-index: 20;
  min-width: 19rem;
  padding: 0.75rem;
  border-radius: 12px;
  border: 1px solid var(--calc-card-secondary-border);
  background: var(--calc-card-secondary-bg);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tip-input {
  min-width: 12rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--calc-border);
  background: var(--calc-bg-soft);
  color: var(--vp-c-text-1);
}

.tip-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tip-button-primary {
  border: 1px solid var(--vp-button-brand-border);
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
}

.tip-button-primary:hover:not(:disabled) {
  border-color: var(--vp-button-brand-hover-border);
  background: var(--vp-button-brand-hover-bg);
  color: var(--vp-button-brand-hover-text);
}

.tip-button-secondary {
  border: 1px solid var(--vp-c-brand-2);
  background: transparent;
  color: var(--vp-c-brand-1);
}

.tip-button-secondary:hover:not(:disabled) {
  background: var(--vp-c-brand-soft);
}

.tip-message {
  margin-top: 0.65rem;
  font-size: 0.76rem;
}

.tip-note {
  margin-top: 0.7rem;
  margin-bottom: 0;
  color: var(--calc-text-3);
  font-size: 0.74rem;
  line-height: 1.45;
}

.footer-affiliate {
  margin-top: 0.95rem;
  margin-bottom: 0.35rem;
  color: var(--calc-text-3);
  font-size: 0.76rem;
  line-height: 1.45;
}

.footer-copyright {
  margin-bottom: 0;
  color: var(--calc-text-2);
  font-size: 0.78rem;
}

.tip-message-success {
  color: var(--vp-c-green-1);
}

.tip-message-error {
  color: var(--vp-c-danger-1);
}

.tip-toast {
  position: fixed;
  top: 1rem;
  left: 50%;
  z-index: 50;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
}

.tip-toast-success {
  border-color: var(--vp-c-green-2);
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-1);
}

.tip-toast-cancel {
  border-color: var(--vp-c-danger-2);
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
}

@media (min-width: 960px) and (max-width: 1439px) {
  .site-footer--with-sidebar .footer-text {
    padding-left: calc(var(--vp-sidebar-width) + 2rem);
  }
}

@media (min-width: 1440px) {
  .site-footer--with-sidebar .footer-text {
    padding-left: calc((100% - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width) + 2rem);
    padding-right: calc((100% - var(--vp-layout-max-width)) / 2 + 1rem);
  }
}

@media (max-width: 959px) {
  .footer-text {
    padding-left: 1rem;
    padding-right: 1rem;
    text-align: center;
  }

  #tip-button-container {
    text-align: center;
  }

  .tip-copy {
    justify-items: center;
  }

  .tip-button-row {
    justify-content: center;
  }

  .tip-custom-anchor {
    margin-left: 0;
  }

  .tip-custom-popup {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    min-width: min(90vw, 19rem);
  }

  .tip-input {
    min-width: 10rem;
  }
}
</style>
