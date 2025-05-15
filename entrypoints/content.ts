import { ContentFinder } from "./highlight/content-finder";
import { HighlightManager } from "./highlight/highlight-manager";

function injectGlobalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* 在这里添加您的全局样式 */
   ::highlight(highlight-line) {
      background-color: #f06;
      color: white;
      padding: 100px;
    }
  `;
  document.head.appendChild(style);
}


export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    window.onload = () => {
      injectGlobalStyles()

      const finder = new ContentFinder()
      const element = finder.findContentContainer()

      if (element) {
        const highlightManager = new HighlightManager(element);
        highlightManager.init();
      }
    }
  },
});
