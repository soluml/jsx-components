/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./example/components.web.jsx":
/*!************************************!*\
  !*** ./example/components.web.jsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MyParagraph\": () => (/* binding */ MyParagraph),\n/* harmony export */   \"OpenButton\": () => (/* binding */ OpenButton)\n/* harmony export */ });\nconst OpenButton = customElements.define(\"cmpt-openbutton\", class CmptOpenButton extends HTMLElement {\n  static get observedAttributes() {\n    return [\"open\", \"disabled\"];\n  }\n\n  constructor() {\n    super();\n    this.shadow = this.attachShadow({\n      mode: \"open\",\n      delegatesFocus: true\n    });\n    const link0 = document.createElement(\"link\");\n    link0.rel = \"stylesheet\";\n    link0.href = \"button.css\";\n    const link1 = document.createElement(\"link\");\n    link1.rel = \"stylesheet\";\n    link1.href = \"dialog.css\";\n    this.attributes = {\n      open: ((oldValue, newValue) => console.log(\"open\", {\n        oldValue,\n        newValue\n      }, this)).bind(this),\n      disabled: function (oldValue, newValue) {\n        console.log(\"disabled\", {\n          oldValue,\n          newValue\n        }, this);\n      }.bind(this)\n    };\n    this.shadowRoot.appendChild(link0);\n    this.shadowRoot.appendChild(link1);\n\n    const __t_300305 = document.createTextNode(\"\\n    \");\n\n    this.shadowRoot.appendChild(__t_300305);\n\n    const __button305402 = document.createElement(\"button\");\n\n    __button305402.setAttribute(\"type\", \"button\");\n\n    __button305402.addEventListener(\"click\", (() => console.log(\"Open Dialog\")).bind(this));\n\n    const __t_370393 = document.createTextNode(\"\\n      Open Dialog\\n    \");\n\n    __button305402.appendChild(__t_370393);\n\n    this.shadowRoot.appendChild(__button305402);\n\n    const __t_402407 = document.createTextNode(\"\\n    \");\n\n    this.shadowRoot.appendChild(__t_402407);\n\n    const __dialog407417 = document.createElement(\"dialog\");\n\n    this.shadowRoot.appendChild(__dialog407417);\n\n    const __t_417420 = document.createTextNode(\"\\n  \");\n\n    this.shadowRoot.appendChild(__t_417420);\n  }\n\n  attributeChangedCallback(name, ...rest) {\n    this.attributes[name](...rest);\n  }\n\n}) || \"cmpt-openbutton\";\nconst slotName = \"subject\";\nconst defaultSubject = \"World\";\nconst MyParagraph = customElements.define(\"cmpt-my-paragraph\", class CmptMyParagraph extends HTMLElement {\n  static get observedAttributes() {\n    return [];\n  }\n\n  constructor() {\n    super();\n    this.shadow = this.attachShadow({\n      mode: \"open\",\n      delegatesFocus: true\n    });\n    const link0 = document.createElement(\"link\");\n    link0.rel = \"stylesheet\";\n    link0.href = \"p.css\";\n    const style = document.createElement(\"style\");\n    style.textContent = \"aasda\";\n    this.attributes = {};\n    this.shadowRoot.appendChild(link0);\n    this.shadowRoot.appendChild(style);\n\n    const __t_595606 = document.createTextNode(\"\\n    Hello \");\n\n    this.shadowRoot.appendChild(__t_595606);\n\n    const __slot606651 = document.createElement(\"slot\");\n\n    __slot606651.setAttribute(\"name\", slotName);\n\n    const __tc_629643 = document.createTextNode(defaultSubject.toString());\n\n    __slot606651.appendChild(__tc_629643);\n\n    this.shadowRoot.appendChild(__slot606651);\n\n    const __t_651655 = document.createTextNode(\"!\\n  \");\n\n    this.shadowRoot.appendChild(__t_651655);\n  }\n\n  attributeChangedCallback(name, ...rest) {\n    this.attributes[name](...rest);\n  }\n\n}, {\n  extends: \"p\"\n}) || \"cmpt-my-paragraph\";\n\n//# sourceURL=webpack://jsx-components/./example/components.web.jsx?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./example/components.web.jsx"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;