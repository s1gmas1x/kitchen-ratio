// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import CookieBanner from './components/CookieBanner.vue'
import Footer from './components/Footer.vue'
import { useRoute } from 'vitepress'
import './style.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
'layout-bottom': () =>  
        h(CookieBanner),
        // Only show footer on non-home pages
        
      
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
}
