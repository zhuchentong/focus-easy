import { TextLine } from "./text-line";
import { TextScanner } from "./text-line-scanner";

export class HighlightManager {
  textScanner: TextScanner;
  textLines: TextLine[];
  currentLineIndex: number;
  targetElement?: HTMLElement;

  constructor(targetElement?: HTMLElement) {
    this.textScanner = new TextScanner();
    this.textLines = [];
    this.currentLineIndex = 0;
    this.targetElement = targetElement;
  }

  init() {
    this.textLines = this.textScanner.scanElement(this.targetElement || document.body);
    this.highlightCurrentLine();
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' && this.currentLineIndex < this.textLines.length - 1) {
      this.currentLineIndex++;
      this.highlightCurrentLine();
      e.stopPropagation();
      e.preventDefault();
    }
    else if (e.key === 'ArrowUp' && this.currentLineIndex > 0) {
      this.currentLineIndex--;
      this.highlightCurrentLine();
      e.stopPropagation();
      e.preventDefault();

    }
  }

  handleResize() {
    this.textLines = this.textScanner.scanElement();
    this.highlightCurrentLine();
  }

  highlightCurrentLine() {
    const highlight = this.textLines[this.currentLineIndex].highlight();
    CSS.highlights.set("highlight-line", highlight);
  }
}