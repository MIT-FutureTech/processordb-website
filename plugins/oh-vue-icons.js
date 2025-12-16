// /* eslint-disable no-undef */
// Client-side only plugin - use synchronous imports for production build compatibility
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  BiChevronDoubleLeft, RiTeamLine, HiDatabase,
  HiHome, MdPrecisionmanufacturing,
  BiGpuCard, GiChart, MdAttachmoney,
  BiCpu, GiCircuitry, GiLogicGateXor, BiChevronCompactUp,
  CoArrowCircleLeft, MdLogin, MdLogout, MdDashboardcustomizeOutlined,
  BiEye, BiEyeSlash, FaUserCircle,
} from 'oh-vue-icons/icons';

export default defineNuxtPlugin({
  name: 'oh-vue-icons',
  mode: 'client', // Only run on client side to avoid SSR issues
  enforce: 'pre', // Ensure this plugin runs before other plugins
  parallel: false, // Don't run in parallel to ensure proper loading order
  setup(nuxtApp) {
    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'plugins/oh-vue-icons.js:16',message:'oh-vue-icons plugin setup called',data:{isServer:typeof process !== 'undefined' && process.server,isClient:typeof window !== 'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    }
    // #endregion
    // Register icons synchronously
    addIcons(
      BiChevronDoubleLeft, RiTeamLine,
      HiDatabase, HiHome, MdPrecisionmanufacturing,
      BiGpuCard, GiChart, MdAttachmoney, BiCpu,
      GiCircuitry, GiLogicGateXor, BiChevronCompactUp,
      CoArrowCircleLeft, MdLogin, MdLogout, MdDashboardcustomizeOutlined,
      BiEye, BiEyeSlash, FaUserCircle
    );

    // Register the component globally
    nuxtApp.vueApp.component("v-icon", OhVueIcon);
    // #region agent log
    if (typeof fetch !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/a2e5b876-28c3-4b64-9549-c4e9792dd0b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'plugins/oh-vue-icons.js:28',message:'v-icon component registered',data:{componentRegistered:!!nuxtApp.vueApp.component('v-icon')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    }
    // #endregion
    console.log('[oh-vue-icons] Plugin loaded and v-icon component registered');
  }
});