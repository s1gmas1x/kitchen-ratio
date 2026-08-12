<script setup>
import { getAffiliateProduct } from '../../data/affiliate-products.mjs'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  newTab: {
    type: Boolean,
    default: false,
  },
  productKey: {
    type: String,
    required: true,
  },
})

const product = getAffiliateProduct(props.productKey)
</script>

<template>
  <a
    v-bind="$attrs"
    :href="product.url"
    :target="newTab ? '_blank' : undefined"
    rel="sponsored noopener noreferrer"
    :data-affiliate-product-key="productKey"
  ><slot>{{ product.label }}</slot></a>
</template>
