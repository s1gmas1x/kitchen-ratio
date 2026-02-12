<template>
  <div
    v-if="tipSuccess"
    class="tip-toast tip-toast-success"
    role="status"
    aria-live="polite"
  >
    Thank you for your support. Your tip was successful.
  </div>

  <div
    v-if="tipCanceled"
    class="tip-toast tip-toast-cancel"
    role="status"
    aria-live="polite"
  >
    Tip checkout was canceled.
  </div>

  <footer class="site-footer">
    <div class="footer-text">
      <p>As an Amazon Associate I earn from qualifying purchases.</p>
      <p>© 2025-{{ year }} KitchenRatio</p>

      <div id="tip-button-container">
        <p>Enjoying KitchenRatio? Drop a tip to support ongoing development.</p>

        <div class="tip-button-row">
          <button
            v-for="amountCents in tipPresetsCents"
            :key="amountCents"
            type="button"
            class="tip-button tip-button-primary"
            :disabled="tipLoading || tipOptionsLoading"
            @click="startTip(amountCents)"
          >
            {{ tipLoading ? 'Opening…' : `Tip ${formatTipAmount(amountCents)}` }}
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
              Tip Custom
            </button>
          </div>
        </div>

        <p v-if="tipSuccess" class="tip-message tip-message-success">
          Thank you for your support. Your tip was successful.
        </p>

        <p v-if="tipError" class="tip-message tip-message-error">
          {{ tipError }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRoute } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const year = new Date().getFullYear()
const route = useRoute()

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

const tipCanceledMessage = 'Tip checkout was canceled.'
const tipTenantKey = 'kitchenratio'
let tipSuccessTimer = null
let tipCanceledTimer = null

const customMinDollars = computed(() => (tipCustomMinCents.value / 100).toFixed(2))
const effectiveCustomMaxCents = computed(() => Math.min(tipCustomMaxCents.value, hardCustomMaxCents))
const customMaxDollars = computed(() => (effectiveCustomMaxCents.value / 100).toFixed(2))
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

.footer-text {
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
  text-align: left;
  line-height: 1.4;
}

#tip-button-container {
  margin-top: 1rem;
  text-align: left;
}

.tip-button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tip-button {
  padding: 0.4rem 0.85rem;
  border-radius: 10px;
  font-size: 0.88rem;
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
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tip-input {
  min-width: 12rem;
  padding: 0.4rem 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
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
  margin-top: 0.5rem;
  font-size: 0.8rem;
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
  .footer-text {
    padding-left: calc(var(--vp-sidebar-width) + 2rem);
  }
}

@media (min-width: 1440px) {
  .footer-text {
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
