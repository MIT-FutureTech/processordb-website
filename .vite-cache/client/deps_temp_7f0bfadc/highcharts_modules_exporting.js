import {
  __commonJS,
  __name
} from "./chunk-FHM2SDB6.js";

// node_modules/highcharts/modules/exporting.js
var require_exporting = __commonJS({
  "node_modules/highcharts/modules/exporting.js"(exports, module) {
    !/**
    * Highcharts JS v11.4.8 (2024-08-29)
    *
    * Exporting module
    *
    * (c) 2010-2024 Torstein Honsi
    *
    * License: www.highcharts.com/license
    */
    (function(e) {
      "object" == typeof module && module.exports ? (e.default = e, module.exports = e) : "function" == typeof define && define.amd ? define("highcharts/modules/exporting", ["highcharts"], function(t) {
        return e(t), e.Highcharts = t, e;
      }) : e("undefined" != typeof Highcharts ? Highcharts : void 0);
    })(function(e) {
      "use strict";
      var t = e ? e._modules : {};
      function n(t2, n2, i, o) {
        t2.hasOwnProperty(n2) || (t2[n2] = o.apply(null, i), "function" == typeof CustomEvent && e.win.dispatchEvent(new CustomEvent("HighchartsModuleLoaded", { detail: { path: n2, module: t2[n2] } })));
      }
      __name(n, "n");
      n(t, "Core/Chart/ChartNavigationComposition.js", [], function() {
        var e2;
        return (function(e3) {
          e3.compose = function(e4) {
            return e4.navigation || (e4.navigation = new t2(e4)), e4;
          };
          const _t = class _t {
            constructor(e4) {
              this.updates = [], this.chart = e4;
            }
            addUpdate(e4) {
              this.chart.navigation.updates.push(e4);
            }
            update(e4, t3) {
              this.updates.forEach((n2) => {
                n2.call(this.chart, e4, t3);
              });
            }
          };
          __name(_t, "t");
          let t2 = _t;
          e3.Additions = t2;
        })(e2 || (e2 = {})), e2;
      }), n(t, "Extensions/Exporting/ExportingDefaults.js", [t["Core/Globals.js"]], function(e2) {
        let { isTouchDevice: t2 } = e2;
        return { exporting: { allowTableSorting: true, type: "image/png", url: "https://export.highcharts.com/", pdfFont: { normal: void 0, bold: void 0, bolditalic: void 0, italic: void 0 }, printMaxWidth: 780, scale: 2, buttons: { contextButton: { className: "highcharts-contextbutton", menuClassName: "highcharts-contextmenu", symbol: "menu", titleKey: "contextButtonTitle", menuItems: ["viewFullscreen", "printChart", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG"] } }, menuItemDefinitions: { viewFullscreen: { textKey: "viewFullscreen", onclick: /* @__PURE__ */ __name(function() {
          this.fullscreen && this.fullscreen.toggle();
        }, "onclick") }, printChart: { textKey: "printChart", onclick: /* @__PURE__ */ __name(function() {
          this.print();
        }, "onclick") }, separator: { separator: true }, downloadPNG: { textKey: "downloadPNG", onclick: /* @__PURE__ */ __name(function() {
          this.exportChart();
        }, "onclick") }, downloadJPEG: { textKey: "downloadJPEG", onclick: /* @__PURE__ */ __name(function() {
          this.exportChart({ type: "image/jpeg" });
        }, "onclick") }, downloadPDF: { textKey: "downloadPDF", onclick: /* @__PURE__ */ __name(function() {
          this.exportChart({ type: "application/pdf" });
        }, "onclick") }, downloadSVG: { textKey: "downloadSVG", onclick: /* @__PURE__ */ __name(function() {
          this.exportChart({ type: "image/svg+xml" });
        }, "onclick") } } }, lang: { viewFullscreen: "View in full screen", exitFullscreen: "Exit from full screen", printChart: "Print chart", downloadPNG: "Download PNG image", downloadJPEG: "Download JPEG image", downloadPDF: "Download PDF document", downloadSVG: "Download SVG vector image", contextButtonTitle: "Chart context menu" }, navigation: { buttonOptions: { symbolSize: 14, symbolX: 14.5, symbolY: 13.5, align: "right", buttonSpacing: 3, height: 28, verticalAlign: "top", width: 28, symbolFill: "#666666", symbolStroke: "#666666", symbolStrokeWidth: 3, theme: { fill: "#ffffff", padding: 5, stroke: "none", "stroke-linecap": "round" } }, menuStyle: { border: "none", borderRadius: "3px", background: "#ffffff", padding: "0.5em" }, menuItemStyle: { background: "none", borderRadius: "3px", color: "#333333", padding: "0.5em", fontSize: t2 ? "0.9em" : "0.8em", transition: "background 250ms, color 250ms" }, menuItemHoverStyle: { background: "#f2f2f2" } } };
      }), n(t, "Extensions/Exporting/ExportingSymbols.js", [], function() {
        var e2;
        return (function(e3) {
          let t2 = [];
          function n2(e4, t3, n3, i2) {
            return [["M", e4, t3 + 2.5], ["L", e4 + n3, t3 + 2.5], ["M", e4, t3 + i2 / 2 + 0.5], ["L", e4 + n3, t3 + i2 / 2 + 0.5], ["M", e4, t3 + i2 - 1.5], ["L", e4 + n3, t3 + i2 - 1.5]];
          }
          __name(n2, "n");
          function i(e4, t3, n3, i2) {
            let o = i2 / 3 - 2;
            return [].concat(this.circle(n3 - o, t3, o, o), this.circle(n3 - o, t3 + o + 4, o, o), this.circle(n3 - o, t3 + 2 * (o + 4), o, o));
          }
          __name(i, "i");
          e3.compose = function(e4) {
            if (-1 === t2.indexOf(e4)) {
              t2.push(e4);
              let o = e4.prototype.symbols;
              o.menu = n2, o.menuball = i.bind(o);
            }
          };
        })(e2 || (e2 = {})), e2;
      }), n(t, "Extensions/Exporting/Fullscreen.js", [t["Core/Renderer/HTML/AST.js"], t["Core/Globals.js"], t["Core/Utilities.js"]], function(e2, t2, n2) {
        let { composed: i } = t2, { addEvent: o, fireEvent: r, pushUnique: s } = n2;
        function l() {
          this.fullscreen = new a(this);
        }
        __name(l, "l");
        const _a = class _a {
          static compose(e3) {
            s(i, "Fullscreen") && o(e3, "beforeRender", l);
          }
          constructor(e3) {
            this.chart = e3, this.isOpen = false;
            let t3 = e3.renderTo;
            !this.browserProps && ("function" == typeof t3.requestFullscreen ? this.browserProps = { fullscreenChange: "fullscreenchange", requestFullscreen: "requestFullscreen", exitFullscreen: "exitFullscreen" } : t3.mozRequestFullScreen ? this.browserProps = { fullscreenChange: "mozfullscreenchange", requestFullscreen: "mozRequestFullScreen", exitFullscreen: "mozCancelFullScreen" } : t3.webkitRequestFullScreen ? this.browserProps = { fullscreenChange: "webkitfullscreenchange", requestFullscreen: "webkitRequestFullScreen", exitFullscreen: "webkitExitFullscreen" } : t3.msRequestFullscreen && (this.browserProps = { fullscreenChange: "MSFullscreenChange", requestFullscreen: "msRequestFullscreen", exitFullscreen: "msExitFullscreen" }));
          }
          close() {
            let e3 = this, t3 = e3.chart, n3 = t3.options.chart;
            r(t3, "fullscreenClose", null, function() {
              e3.isOpen && e3.browserProps && t3.container.ownerDocument instanceof Document && t3.container.ownerDocument[e3.browserProps.exitFullscreen](), e3.unbindFullscreenEvent && (e3.unbindFullscreenEvent = e3.unbindFullscreenEvent()), t3.setSize(e3.origWidth, e3.origHeight, false), e3.origWidth = void 0, e3.origHeight = void 0, n3.width = e3.origWidthOption, n3.height = e3.origHeightOption, e3.origWidthOption = void 0, e3.origHeightOption = void 0, e3.isOpen = false, e3.setButtonText();
            });
          }
          open() {
            let e3 = this, t3 = e3.chart, n3 = t3.options.chart;
            r(t3, "fullscreenOpen", null, function() {
              if (n3 && (e3.origWidthOption = n3.width, e3.origHeightOption = n3.height), e3.origWidth = t3.chartWidth, e3.origHeight = t3.chartHeight, e3.browserProps) {
                let n4 = o(t3.container.ownerDocument, e3.browserProps.fullscreenChange, function() {
                  e3.isOpen ? (e3.isOpen = false, e3.close()) : (t3.setSize(null, null, false), e3.isOpen = true, e3.setButtonText());
                }), i2 = o(t3, "destroy", n4);
                e3.unbindFullscreenEvent = () => {
                  n4(), i2();
                };
                let r2 = t3.renderTo[e3.browserProps.requestFullscreen]();
                r2 && r2.catch(function() {
                  alert("Full screen is not supported inside a frame.");
                });
              }
            });
          }
          setButtonText() {
            let t3 = this.chart, n3 = t3.exportDivElements, i2 = t3.options.exporting, o2 = i2 && i2.buttons && i2.buttons.contextButton.menuItems, r2 = t3.options.lang;
            if (i2 && i2.menuItemDefinitions && r2 && r2.exitFullscreen && r2.viewFullscreen && o2 && n3) {
              let t4 = n3[o2.indexOf("viewFullscreen")];
              t4 && e2.setElementHTML(t4, this.isOpen ? r2.exitFullscreen : i2.menuItemDefinitions.viewFullscreen.text || r2.viewFullscreen);
            }
          }
          toggle() {
            this.isOpen ? this.close() : this.open();
          }
        };
        __name(_a, "a");
        let a = _a;
        return a;
      }), n(t, "Core/HttpUtilities.js", [t["Core/Globals.js"], t["Core/Utilities.js"]], function(e2, t2) {
        let { win: n2 } = e2, { discardElement: i, objectEach: o } = t2, r = { ajax: /* @__PURE__ */ __name(function(e3) {
          let t3 = { json: "application/json", xml: "application/xml", text: "text/plain", octet: "application/octet-stream" }, n3 = new XMLHttpRequest();
          function i2(t4, n4) {
            e3.error && e3.error(t4, n4);
          }
          __name(i2, "i");
          if (!e3.url) return false;
          n3.open((e3.type || "get").toUpperCase(), e3.url, true), e3.headers && e3.headers["Content-Type"] || n3.setRequestHeader("Content-Type", t3[e3.dataType || "json"] || t3.text), o(e3.headers, function(e4, t4) {
            n3.setRequestHeader(t4, e4);
          }), e3.responseType && (n3.responseType = e3.responseType), n3.onreadystatechange = function() {
            let t4;
            if (4 === n3.readyState) {
              if (200 === n3.status) {
                if ("blob" !== e3.responseType && (t4 = n3.responseText, "json" === e3.dataType)) try {
                  t4 = JSON.parse(t4);
                } catch (e4) {
                  if (e4 instanceof Error) return i2(n3, e4);
                }
                return e3.success && e3.success(t4, n3);
              }
              i2(n3, n3.responseText);
            }
          }, e3.data && "string" != typeof e3.data && (e3.data = JSON.stringify(e3.data)), n3.send(e3.data);
        }, "ajax"), getJSON: /* @__PURE__ */ __name(function(e3, t3) {
          r.ajax({ url: e3, success: t3, dataType: "json", headers: { "Content-Type": "text/plain" } });
        }, "getJSON"), post: /* @__PURE__ */ __name(function(e3, t3, r2) {
          let s = new n2.FormData();
          o(t3, function(e4, t4) {
            s.append(t4, e4);
          }), s.append("b64", "true");
          let { filename: l, type: a } = t3;
          return n2.fetch(e3, { method: "POST", body: s, ...r2 }).then((e4) => {
            e4.ok && e4.text().then((e5) => {
              let t4 = document.createElement("a");
              t4.href = `data:${a};base64,${e5}`, t4.download = l, t4.click(), i(t4);
            });
          });
        }, "post") };
        return r;
      }), n(t, "Extensions/Exporting/Exporting.js", [t["Core/Renderer/HTML/AST.js"], t["Core/Chart/Chart.js"], t["Core/Chart/ChartNavigationComposition.js"], t["Core/Defaults.js"], t["Extensions/Exporting/ExportingDefaults.js"], t["Extensions/Exporting/ExportingSymbols.js"], t["Extensions/Exporting/Fullscreen.js"], t["Core/Globals.js"], t["Core/HttpUtilities.js"], t["Core/Utilities.js"]], function(e2, t2, n2, i, o, r, s, l, a, c) {
        var u;
        let { defaultOptions: p } = i, { doc: h, SVG_NS: d, win: g } = l, { addEvent: f, css: m, createElement: x, discardElement: y, extend: b, find: v, fireEvent: w, isObject: E, merge: C, objectEach: S, pick: F, removeEvent: T, uniqueKey: O } = c;
        return (function(t3) {
          let i2;
          let u2 = [/-/, /^(clipPath|cssText|d|height|width)$/, /^font$/, /[lL]ogical(Width|Height)$/, /^parentRule$/, /^(cssRules|ownerRules)$/, /perspective/, /TapHighlightColor/, /^transition/, /^length$/, /^\d+$/], M = ["fill", "stroke", "strokeLinecap", "strokeLinejoin", "strokeWidth", "textAnchor", "x", "y"];
          t3.inlineAllowlist = [];
          let P = ["clipPath", "defs", "desc"];
          function k(e3) {
            let t4, n3;
            let i3 = this, o2 = i3.renderer, r2 = C(i3.options.navigation.buttonOptions, e3), s2 = r2.onclick, l2 = r2.menuItems, a2 = r2.symbolSize || 12;
            if (i3.btnCount || (i3.btnCount = 0), i3.exportDivElements || (i3.exportDivElements = [], i3.exportSVGElements = []), false === r2.enabled || !r2.theme) return;
            let c2 = i3.styledMode ? {} : r2.theme;
            s2 ? n3 = /* @__PURE__ */ __name(function(e4) {
              e4 && e4.stopPropagation(), s2.call(i3, e4);
            }, "n") : l2 && (n3 = /* @__PURE__ */ __name(function(e4) {
              e4 && e4.stopPropagation(), i3.contextMenu(u3.menuClassName, l2, u3.translateX || 0, u3.translateY || 0, u3.width || 0, u3.height || 0, u3), u3.setState(2);
            }, "n")), r2.text && r2.symbol ? c2.paddingLeft = F(c2.paddingLeft, 30) : r2.text || b(c2, { width: r2.width, height: r2.height, padding: 0 });
            let u3 = o2.button(r2.text, 0, 0, n3, c2, void 0, void 0, void 0, void 0, r2.useHTML).addClass(e3.className).attr({ title: F(i3.options.lang[r2._titleKey || r2.titleKey], "") });
            u3.menuClassName = e3.menuClassName || "highcharts-menu-" + i3.btnCount++, r2.symbol && (t4 = o2.symbol(r2.symbol, Math.round((r2.symbolX || 0) - a2 / 2), Math.round((r2.symbolY || 0) - a2 / 2), a2, a2, { width: a2, height: a2 }).addClass("highcharts-button-symbol").attr({ zIndex: 1 }).add(u3), i3.styledMode || t4.attr({ stroke: r2.symbolStroke, fill: r2.symbolFill, "stroke-width": r2.symbolStrokeWidth || 1 })), u3.add(i3.exportingGroup).align(b(r2, { width: u3.width, x: F(r2.x, i3.buttonOffset) }), true, "spacingBox"), i3.buttonOffset += ((u3.width || 0) + r2.buttonSpacing) * ("right" === r2.align ? -1 : 1), i3.exportSVGElements.push(u3, t4);
          }
          __name(k, "k");
          function N() {
            if (!this.printReverseInfo) return;
            let { childNodes: e3, origDisplay: t4, resetParams: n3 } = this.printReverseInfo;
            this.moveContainers(this.renderTo), [].forEach.call(e3, function(e4, n4) {
              1 === e4.nodeType && (e4.style.display = t4[n4] || "");
            }), this.isPrinting = false, n3 && this.setSize.apply(this, n3), delete this.printReverseInfo, i2 = void 0, w(this, "afterPrint");
          }
          __name(N, "N");
          function H() {
            let e3 = h.body, t4 = this.options.exporting.printMaxWidth, n3 = { childNodes: e3.childNodes, origDisplay: [], resetParams: void 0 };
            this.isPrinting = true, this.pointer?.reset(void 0, 0), w(this, "beforePrint"), t4 && this.chartWidth > t4 && (n3.resetParams = [this.options.chart.width, void 0, false], this.setSize(t4, void 0, false)), [].forEach.call(n3.childNodes, function(e4, t5) {
              1 === e4.nodeType && (n3.origDisplay[t5] = e4.style.display, e4.style.display = "none");
            }), this.moveContainers(e3), this.printReverseInfo = n3;
          }
          __name(H, "H");
          function j(e3) {
            e3.renderExporting(), f(e3, "redraw", e3.renderExporting), f(e3, "destroy", e3.destroyExport);
          }
          __name(j, "j");
          function G(t4, n3, i3, o2, r2, s2, l2) {
            let a2 = this, u3 = a2.options.navigation, p2 = a2.chartWidth, d2 = a2.chartHeight, y2 = "cache-" + t4, v2 = Math.max(r2, s2), C2, S2 = a2[y2];
            S2 || (a2.exportContextMenu = a2[y2] = S2 = x("div", { className: t4 }, { position: "absolute", zIndex: 1e3, padding: v2 + "px", pointerEvents: "auto", ...a2.renderer.style }, a2.scrollablePlotArea?.fixedDiv || a2.container), C2 = x("ul", { className: "highcharts-menu" }, a2.styledMode ? {} : { listStyle: "none", margin: 0, padding: 0 }, S2), a2.styledMode || m(C2, b({ MozBoxShadow: "3px 3px 10px #888", WebkitBoxShadow: "3px 3px 10px #888", boxShadow: "3px 3px 10px #888" }, u3.menuStyle)), S2.hideMenu = function() {
              m(S2, { display: "none" }), l2 && l2.setState(0), a2.openMenu = false, m(a2.renderTo, { overflow: "hidden" }), m(a2.container, { overflow: "hidden" }), c.clearTimeout(S2.hideTimer), w(a2, "exportMenuHidden");
            }, a2.exportEvents.push(f(S2, "mouseleave", function() {
              S2.hideTimer = g.setTimeout(S2.hideMenu, 500);
            }), f(S2, "mouseenter", function() {
              c.clearTimeout(S2.hideTimer);
            }), f(h, "mouseup", function(e3) {
              a2.pointer?.inClass(e3.target, t4) || S2.hideMenu();
            }), f(S2, "click", function() {
              a2.openMenu && S2.hideMenu();
            })), n3.forEach(function(t5) {
              if ("string" == typeof t5 && (t5 = a2.options.exporting.menuItemDefinitions[t5]), E(t5, true)) {
                let n4;
                t5.separator ? n4 = x("hr", void 0, void 0, C2) : ("viewData" === t5.textKey && a2.isDataTableVisible && (t5.textKey = "hideData"), n4 = x("li", { className: "highcharts-menu-item", onclick: /* @__PURE__ */ __name(function(e3) {
                  e3 && e3.stopPropagation(), S2.hideMenu(), "string" != typeof t5 && t5.onclick && t5.onclick.apply(a2, arguments);
                }, "onclick") }, void 0, C2), e2.setElementHTML(n4, t5.text || a2.options.lang[t5.textKey]), a2.styledMode || (n4.onmouseover = function() {
                  m(this, u3.menuItemHoverStyle);
                }, n4.onmouseout = function() {
                  m(this, u3.menuItemStyle);
                }, m(n4, b({ cursor: "pointer" }, u3.menuItemStyle || {})))), a2.exportDivElements.push(n4);
              }
            }), a2.exportDivElements.push(C2, S2), a2.exportMenuWidth = S2.offsetWidth, a2.exportMenuHeight = S2.offsetHeight);
            let F2 = { display: "block" };
            i3 + (a2.exportMenuWidth || 0) > p2 ? F2.right = p2 - i3 - r2 - v2 + "px" : F2.left = i3 - v2 + "px", o2 + s2 + (a2.exportMenuHeight || 0) > d2 && l2.alignOptions?.verticalAlign !== "top" ? F2.bottom = d2 - o2 - v2 + "px" : F2.top = o2 + s2 - v2 + "px", m(S2, F2), m(a2.renderTo, { overflow: "" }), m(a2.container, { overflow: "" }), a2.openMenu = true, w(a2, "exportMenuShown");
          }
          __name(G, "G");
          function D(e3) {
            let t4;
            let n3 = e3 ? e3.target : this, i3 = n3.exportSVGElements, o2 = n3.exportDivElements, r2 = n3.exportEvents;
            i3 && (i3.forEach((e4, o3) => {
              e4 && (e4.onclick = e4.ontouchstart = null, n3[t4 = "cache-" + e4.menuClassName] && delete n3[t4], i3[o3] = e4.destroy());
            }), i3.length = 0), n3.exportingGroup && (n3.exportingGroup.destroy(), delete n3.exportingGroup), o2 && (o2.forEach(function(e4, t5) {
              e4 && (c.clearTimeout(e4.hideTimer), T(e4, "mouseleave"), o2[t5] = e4.onmouseout = e4.onmouseover = e4.ontouchstart = e4.onclick = null, y(e4));
            }), o2.length = 0), r2 && (r2.forEach(function(e4) {
              e4();
            }), r2.length = 0);
          }
          __name(D, "D");
          function I(e3, t4) {
            let n3 = this.getSVGForExport(e3, t4);
            e3 = C(this.options.exporting, e3), a.post(e3.url, { filename: e3.filename ? e3.filename.replace(/\//g, "-") : this.getFilename(), type: e3.type, width: e3.width, scale: e3.scale, svg: n3 }, e3.fetchOptions);
          }
          __name(I, "I");
          function W() {
            return this.styledMode && this.inlineStyles(), this.container.innerHTML;
          }
          __name(W, "W");
          function R() {
            let e3 = this.userOptions.title && this.userOptions.title.text, t4 = this.options.exporting.filename;
            return t4 ? t4.replace(/\//g, "-") : ("string" == typeof e3 && (t4 = e3.toLowerCase().replace(/<\/?[^>]+(>|$)/g, "").replace(/[\s_]+/g, "-").replace(/[^a-z\d\-]/g, "").replace(/^[\-]+/g, "").replace(/[\-]+/g, "-").substr(0, 24).replace(/[\-]+$/g, "")), (!t4 || t4.length < 5) && (t4 = "chart"), t4);
          }
          __name(R, "R");
          function L(e3) {
            let t4, n3, i3 = C(this.options, e3);
            i3.plotOptions = C(this.userOptions.plotOptions, e3 && e3.plotOptions), i3.time = C(this.userOptions.time, e3 && e3.time);
            let o2 = x("div", null, { position: "absolute", top: "-9999em", width: this.chartWidth + "px", height: this.chartHeight + "px" }, h.body), r2 = this.renderTo.style.width, s2 = this.renderTo.style.height, l2 = i3.exporting.sourceWidth || i3.chart.width || /px$/.test(r2) && parseInt(r2, 10) || (i3.isGantt ? 800 : 600), a2 = i3.exporting.sourceHeight || i3.chart.height || /px$/.test(s2) && parseInt(s2, 10) || 400;
            b(i3.chart, { animation: false, renderTo: o2, forExport: true, renderer: "SVGRenderer", width: l2, height: a2 }), i3.exporting.enabled = false, delete i3.data, i3.series = [], this.series.forEach(function(e4) {
              (n3 = C(e4.userOptions, { animation: false, enableMouseTracking: false, showCheckbox: false, visible: e4.visible })).isInternal || i3.series.push(n3);
            });
            let c2 = {};
            this.axes.forEach(function(e4) {
              e4.userOptions.internalKey || (e4.userOptions.internalKey = O()), e4.options.isInternal || (c2[e4.coll] || (c2[e4.coll] = true, i3[e4.coll] = []), i3[e4.coll].push(C(e4.userOptions, { visible: e4.visible, type: e4.type, uniqueNames: e4.uniqueNames })));
            }), i3.colorAxis = this.userOptions.colorAxis;
            let u3 = new this.constructor(i3, this.callback);
            return e3 && ["xAxis", "yAxis", "series"].forEach(function(t5) {
              let n4 = {};
              e3[t5] && (n4[t5] = e3[t5], u3.update(n4));
            }), this.axes.forEach(function(e4) {
              let t5 = v(u3.axes, function(t6) {
                return t6.options.internalKey === e4.userOptions.internalKey;
              }), n4 = e4.getExtremes(), i4 = n4.userMin, o3 = n4.userMax;
              t5 && (void 0 !== i4 && i4 !== t5.min || void 0 !== o3 && o3 !== t5.max) && t5.setExtremes(i4, o3, true, false);
            }), t4 = u3.getChartHTML(), w(this, "getSVG", { chartCopy: u3 }), t4 = this.sanitizeSVG(t4, i3), i3 = null, u3.destroy(), y(o2), t4;
          }
          __name(L, "L");
          function q(e3, t4) {
            let n3 = this.options.exporting;
            return this.getSVG(C({ chart: { borderRadius: 0 } }, n3.chartOptions, t4, { exporting: { sourceWidth: e3 && e3.sourceWidth || n3.sourceWidth, sourceHeight: e3 && e3.sourceHeight || n3.sourceHeight } }));
          }
          __name(q, "q");
          function $() {
            let e3;
            let n3 = t3.inlineAllowlist, i3 = {}, o2 = h.createElement("iframe");
            m(o2, { width: "1px", height: "1px", visibility: "hidden" }), h.body.appendChild(o2);
            let r2 = o2.contentWindow && o2.contentWindow.document;
            r2 && r2.body.appendChild(r2.createElementNS(d, "svg")), (/* @__PURE__ */ __name(function t4(o3) {
              let s2, a2, c2, p2, h2, d2;
              let f2 = {};
              if (r2 && 1 === o3.nodeType && -1 === P.indexOf(o3.nodeName)) {
                if (s2 = g.getComputedStyle(o3, null), a2 = "svg" === o3.nodeName ? {} : g.getComputedStyle(o3.parentNode, null), !i3[o3.nodeName]) {
                  e3 = r2.getElementsByTagName("svg")[0], c2 = r2.createElementNS(o3.namespaceURI, o3.nodeName), e3.appendChild(c2);
                  let t5 = g.getComputedStyle(c2, null), n4 = {};
                  for (let e4 in t5) e4.length < 1e3 && "string" == typeof t5[e4] && !/^\d+$/.test(e4) && (n4[e4] = t5[e4]);
                  i3[o3.nodeName] = n4, "text" === o3.nodeName && delete i3.text.fill, e3.removeChild(c2);
                }
                for (let e4 in s2) (l.isFirefox || l.isMS || l.isSafari || Object.hasOwnProperty.call(s2, e4)) && (function(e5, t5) {
                  if (p2 = h2 = false, n3.length) {
                    for (d2 = n3.length; d2-- && !h2; ) h2 = n3[d2].test(t5);
                    p2 = !h2;
                  }
                  for ("transform" === t5 && "none" === e5 && (p2 = true), d2 = u2.length; d2-- && !p2; ) {
                    if (t5.length > 1e3) throw Error("Input too long");
                    p2 = u2[d2].test(t5) || "function" == typeof e5;
                  }
                  !p2 && (a2[t5] !== e5 || "svg" === o3.nodeName) && i3[o3.nodeName][t5] !== e5 && (M && -1 === M.indexOf(t5) ? f2[t5] = e5 : e5 && o3.setAttribute(t5.replace(/[A-Z]/g, function(e6) {
                    return "-" + e6.toLowerCase();
                  }), e5));
                })(s2[e4], e4);
                if (m(o3, f2), "svg" === o3.nodeName && o3.setAttribute("stroke-width", "1px"), "text" === o3.nodeName) return;
                [].forEach.call(o3.children || o3.childNodes, t4);
              }
            }, "t"))(this.container.querySelector("svg")), e3.parentNode.removeChild(e3), o2.parentNode.removeChild(o2);
          }
          __name($, "$");
          function z(e3) {
            let { scrollablePlotArea: t4 } = this;
            (t4 ? [t4.fixedDiv, t4.scrollingContainer] : [this.container]).forEach(function(t5) {
              e3.appendChild(t5);
            });
          }
          __name(z, "z");
          function V() {
            let e3 = this, t4 = /* @__PURE__ */ __name((t5, n3, i3) => {
              e3.isDirtyExporting = true, C(true, e3.options[t5], n3), F(i3, true) && e3.redraw();
            }, "t");
            e3.exporting = { update: /* @__PURE__ */ __name(function(e4, n3) {
              t4("exporting", e4, n3);
            }, "update") }, n2.compose(e3).navigation.addUpdate((e4, n3) => {
              t4("navigation", e4, n3);
            });
          }
          __name(V, "V");
          function A() {
            let e3 = this;
            e3.isPrinting || (i2 = e3, l.isSafari || e3.beforePrint(), setTimeout(() => {
              g.focus(), g.print(), l.isSafari || setTimeout(() => {
                e3.afterPrint();
              }, 1e3);
            }, 1));
          }
          __name(A, "A");
          function K() {
            let e3 = this, t4 = e3.options.exporting, n3 = t4.buttons, i3 = e3.isDirtyExporting || !e3.exportSVGElements;
            e3.buttonOffset = 0, e3.isDirtyExporting && e3.destroyExport(), i3 && false !== t4.enabled && (e3.exportEvents = [], e3.exportingGroup = e3.exportingGroup || e3.renderer.g("exporting-group").attr({ zIndex: 3 }).add(), S(n3, function(t5) {
              e3.addButton(t5);
            }), e3.isDirtyExporting = false);
          }
          __name(K, "K");
          function U(e3, t4) {
            let n3 = e3.indexOf("</svg>") + 6, i3 = e3.substr(n3);
            return e3 = e3.substr(0, n3), t4 && t4.exporting && t4.exporting.allowHTML && i3 && (i3 = '<foreignObject x="0" y="0" width="' + t4.chart.width + '" height="' + t4.chart.height + '"><body xmlns="http://www.w3.org/1999/xhtml">' + i3.replace(/(<(?:img|br).*?(?=\>))>/g, "$1 />") + "</body></foreignObject>", e3 = e3.replace("</svg>", i3 + "</svg>")), e3 = e3.replace(/zIndex="[^"]+"/g, "").replace(/symbolName="[^"]+"/g, "").replace(/jQuery\d+="[^"]+"/g, "").replace(/url\(("|&quot;)(.*?)("|&quot;)\;?\)/g, "url($2)").replace(/url\([^#]+#/g, "url(#").replace(/<svg /, '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/ (NS\d+\:)?href=/g, " xlink:href=").replace(/\n+/g, " ").replace(/(fill|stroke)="rgba\(([ \d]+,[ \d]+,[ \d]+),([ \d\.]+)\)"/g, '$1="rgb($2)" $1-opacity="$3"').replace(/&nbsp;/g, " ").replace(/&shy;/g, "­");
          }
          __name(U, "U");
          t3.compose = function(e3, t4) {
            r.compose(t4), s.compose(e3);
            let n3 = e3.prototype;
            n3.exportChart || (n3.afterPrint = N, n3.exportChart = I, n3.inlineStyles = $, n3.print = A, n3.sanitizeSVG = U, n3.getChartHTML = W, n3.getSVG = L, n3.getSVGForExport = q, n3.getFilename = R, n3.moveContainers = z, n3.beforePrint = H, n3.contextMenu = G, n3.addButton = k, n3.destroyExport = D, n3.renderExporting = K, n3.callbacks.push(j), f(e3, "init", V), l.isSafari && g.matchMedia("print").addListener(function(e4) {
              i2 && (e4.matches ? i2.beforePrint() : i2.afterPrint());
            }), p.exporting = C(o.exporting, p.exporting), p.lang = C(o.lang, p.lang), p.navigation = C(o.navigation, p.navigation));
          };
        })(u || (u = {})), u;
      }), n(t, "masters/modules/exporting.src.js", [t["Core/Globals.js"], t["Extensions/Exporting/Exporting.js"], t["Core/HttpUtilities.js"]], function(e2, t2, n2) {
        return e2.HttpUtilities = e2.HttpUtilities || n2, e2.ajax = e2.HttpUtilities.ajax, e2.getJSON = e2.HttpUtilities.getJSON, e2.post = e2.HttpUtilities.post, t2.compose(e2.Chart, e2.Renderer), e2;
      });
    });
  }
});
export default require_exporting();
//# sourceMappingURL=highcharts_modules_exporting.js.map
