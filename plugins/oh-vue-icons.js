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
  setup(nuxtApp) {
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
    console.log('[oh-vue-icons] Plugin loaded and v-icon component registered');
  }
});