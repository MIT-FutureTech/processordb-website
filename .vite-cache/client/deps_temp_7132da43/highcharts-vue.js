import {
  require_highcharts
} from "./chunk-3RMYVJA7.js";
import {
  __commonJS,
  __name
} from "./chunk-CCBZZ47G.js";

// vite:cjs-external-facade:vue
import * as m from "vue";
var require_vue = __commonJS({
  "vite:cjs-external-facade:vue"(exports, module) {
    module.exports = { ...m };
  }
});

// node_modules/highcharts-vue/dist/highcharts-vue.min.js
var require_highcharts_vue_min = __commonJS({
  "node_modules/highcharts-vue/dist/highcharts-vue.min.js"(exports, module) {
    !(function(t, r) {
      "object" == typeof exports && "object" == typeof module ? module.exports = r(require_highcharts(), require_vue()) : "function" == typeof define && define.amd ? define(["highcharts", "vue"], r) : "object" == typeof exports ? exports.HighchartsVue = r(require_highcharts(), require_vue()) : t.HighchartsVue = r(t.Highcharts, t.Vue);
    })(self, ((t, r) => (() => {
      "use strict";
      var e = { 879: (r2) => {
        r2.exports = t;
      }, 744: (t2) => {
        t2.exports = r;
      } }, o = {};
      function n(t2) {
        var r2 = o[t2];
        if (void 0 !== r2) return r2.exports;
        var a2 = o[t2] = { exports: {} };
        return e[t2](a2, a2.exports, n), a2.exports;
      }
      __name(n, "n");
      n.n = (t2) => {
        var r2 = t2 && t2.__esModule ? () => t2.default : () => t2;
        return n.d(r2, { a: r2 }), r2;
      }, n.d = (t2, r2) => {
        for (var e2 in r2) n.o(r2, e2) && !n.o(t2, e2) && Object.defineProperty(t2, e2, { enumerable: true, get: r2[e2] });
      }, n.o = (t2, r2) => Object.prototype.hasOwnProperty.call(t2, r2), n.r = (t2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
      };
      var a = {};
      return (() => {
        n.r(a), n.d(a, { Chart: /* @__PURE__ */ __name(() => s, "Chart"), default: /* @__PURE__ */ __name(() => h, "default") });
        var t2 = n(879), r2 = n.n(t2), e2 = /* @__PURE__ */ __name(function t3(e3, o3) {
          var n2 = r2().isArray(e3) ? [] : {};
          function a2(e4, a3) {
            !r2().isObject(e4, !o3) || r2().isClass(e4) || r2().isDOMElement(e4) ? n2[a3] = e4 : n2[a3] = t3(e4, o3);
          }
          __name(a2, "a");
          return r2().isArray(e3) ? e3.forEach((function(t4, r3) {
            return a2(t4, r3);
          })) : r2().objectEach(e3, a2), n2;
        }, "t"), o2 = n(744);
        function i(t3) {
          return (function(t4) {
            if (Array.isArray(t4)) return c(t4);
          })(t3) || (function(t4) {
            if ("undefined" != typeof Symbol && null != t4[Symbol.iterator] || null != t4["@@iterator"]) return Array.from(t4);
          })(t3) || (function(t4, r3) {
            if (!t4) return;
            if ("string" == typeof t4) return c(t4, r3);
            var e3 = Object.prototype.toString.call(t4).slice(8, -1);
            "Object" === e3 && t4.constructor && (e3 = t4.constructor.name);
            if ("Map" === e3 || "Set" === e3) return Array.from(t4);
            if ("Arguments" === e3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e3)) return c(t4, r3);
          })(t3) || (function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          })();
        }
        __name(i, "i");
        function c(t3, r3) {
          (null == r3 || r3 > t3.length) && (r3 = t3.length);
          for (var e3 = 0, o3 = new Array(r3); e3 < r3; e3++) o3[e3] = t3[e3];
          return o3;
        }
        __name(c, "c");
        const u = /* @__PURE__ */ __name(function(t3) {
          var r3 = this;
          return { render: /* @__PURE__ */ __name(function() {
            return (0, o2.h)("div", { ref: "chart" });
          }, "render"), beforeUnmount: /* @__PURE__ */ __name(function() {
            var t4;
            return null == r3 || null === (t4 = r3.chart) || void 0 === t4 ? void 0 : t4.destroy();
          }, "beforeUnmount"), props: { constructorType: { type: String, default: "chart" }, options: { type: Object, required: true }, callback: Function, updateArgs: { type: Array, default: /* @__PURE__ */ __name(function() {
            return [true, true];
          }, "default") }, highcharts: { type: Object }, deepCopyOnUpdate: { type: Boolean, default: true } }, watch: { options: { handler: /* @__PURE__ */ __name(function(t4) {
            var r4;
            (r4 = this.chart).update.apply(r4, [e2(t4, this.deepCopyOnUpdate)].concat(i(this.updateArgs)));
          }, "handler"), deep: true } }, mounted: /* @__PURE__ */ __name(function() {
            var r4 = this.highcharts || t3;
            r4[this.constructorType] ? this.options ? this.chart = r4[this.constructorType](this.$refs.chart, e2(this.options, true), this.callback ? this.callback : null) : console.error('The "options" parameter was not passed.') : console.error("'".concat(this.constructorType, "' constructor-type is incorrect. Sometimes this error is caused by the fact, that the corresponding module wasn't imported."));
          }, "mounted") };
        }, "u");
        var s = u(r2());
        function h(t3) {
          var e3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          t3.component(e3.tagName || "highcharts", u(e3.highcharts || r2()));
        }
        __name(h, "h");
      })(), a;
    })()));
  }
});
export default require_highcharts_vue_min();
//# sourceMappingURL=highcharts-vue.js.map
