import { TextLine } from './text-line';

export class TextScanner {
  textLines: TextLine[];
  allTextNodes: Node[];
  
  constructor() {
    this.textLines = [];
    this.allTextNodes = [];
  }

  scanElement(element: HTMLElement = document.body) {
    const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let currentNode = treeWalker.nextNode();
    
    while (currentNode) {
      if (currentNode.textContent && currentNode.textContent.trim().length !== 0) {
        this.allTextNodes.push(currentNode);
      }
      currentNode = treeWalker.nextNode();
    }
    
    this.extractLines();
    return this.textLines;
  }

   getFirstNonWhitespaceIndex(text : string) {
    const match = text.match(/\S/);
    return match ? match.index! : -1;
  }

   getTextBoundRect(node: Node, index:number) {
    const range = new Range();
    range.setStart(node, index);
    range.setEnd(node, index + 1);
    return range.getBoundingClientRect();
  }

   extractLines() {
    this.textLines = [];
    this.allTextNodes.forEach(node => this.extractNodeLines(node));
  }

   extractNodeLines(node: Node) {
    const firstTextIndex = this.getFirstNonWhitespaceIndex(node.textContent!);
    const lastTextIndex = node.textContent!.length - 1;
    let start = firstTextIndex;
    let startRect = this.getTextBoundRect(node, start!);
    
    for (let i = firstTextIndex + 1; i <= lastTextIndex; i++) {
      const currentRect = this.getTextBoundRect(node, i);
      if (currentRect.top !== startRect.top) {
        this.textLines.push(new TextLine(node, start, i - 1));
        start = i;
        startRect = currentRect;
      }
    }
    this.textLines.push(new TextLine(node, start, lastTextIndex+1));
  }
}
