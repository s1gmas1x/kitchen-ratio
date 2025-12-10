import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import CookieBanner from './components/CookieBanner.vue'
import Footer from './components/Footer.vue'
import './style.css'

/**
 * A functional wrapper component that:
 *  - forwards props & slots to DefaultTheme.Layout
 *  - injects CookieBanner and Footer into the 'layout-bottom' slot
 *  - only renders Footer when route.path !== '/'
 */
export default {
  extends: DefaultTheme,
  Layout: (props, ctx) => {
    // useRoute() is allowed in a functional component (it's the component's setup)
    const route = useRoute()

    // build the bottom slot content
    const bottomSlot = () => {
      const items = [ h(CookieBanner) ]
      if (route.path !== '/' && route.path !== '/404.html')  items.push(h(Footer))
      return items
    }

    // forward everything to DefaultTheme.Layout and inject our 'layout-bottom'
    return h(
      DefaultTheme.Layout,
      props,
      {
        // keep all original slots intact
        ...ctx.slots,
        // override/add the layout-bottom slot
        'layout-bottom': bottomSlot
      }
    )
  },

  enhanceApp({ app, router, siteData }) {
    // your existing enhanceApp logic, if any
  }
}
