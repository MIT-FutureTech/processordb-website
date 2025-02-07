import { OhVueIcon, addIcons } from "oh-vue-icons";
import { 
  BiChevronDoubleLeft, RiTeamLine, HiDatabase,
  HiHome, MdPrecisionmanufacturing,
  BiGpuCard, GiChart, MdAttachmoney,
  BiCpu, GiCircuitry, GiLogicGateXor, BiChevronCompactUp,
  CoArrowCircleLeft, MdLogin
} from "oh-vue-icons/icons";

addIcons(
  BiChevronDoubleLeft, RiTeamLine,
  HiDatabase, HiHome, MdPrecisionmanufacturing,
  BiGpuCard, GiChart, MdAttachmoney, BiCpu,
  GiCircuitry, GiLogicGateXor, BiChevronCompactUp,
  CoArrowCircleLeft, MdLogin
);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("v-icon", OhVueIcon);
});