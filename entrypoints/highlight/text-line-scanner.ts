import { TextLine } from './text-line';

export class TextScanner {
  textLines: TextLine[] = [];
  textNodes: Node[] = [];
  textRanges: Range[] = [];
  lastRange?: Range;
  currentTextLine?: TextLine

  constructor() {
    this.textLines = [];
    this.textNodes = [];
  }

  scanElement(element: HTMLElement = document.body) {
    const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let currentNode = treeWalker.nextNode();

    while (currentNode) {
      if (currentNode.textContent && currentNode.textContent.trim().length !== 0) {
        this.textNodes.push(currentNode);
      }
      currentNode = treeWalker.nextNode();
    }

    this.extractLines();
    return this.textLines;
  }

  getFirstNonWhitespaceIndex(text: string) {
    const match = text.match(/\S/);
    return match ? match.index! : -1;
  }

  getTextBoundRect(node: Node, index: number) {
    const range = new Range();
    range.setStart(node, index);
    range.setEnd(node, index + 1);
    return range.getBoundingClientRect();
  }

  extractLines() {
    this.textLines = [];
    this.textRanges = [];

    this.textNodes.forEach((node,index) => this.extractRange(node,index));
    this.rangesToLine()
  }

  rangesToLine() {
    if (!this.textRanges.length) {
      return
    }

    const textLine = new TextLine(this.textRanges)
    this.textLines.push(textLine)

    this.textRanges = []
    this.lastRange = undefined
  }

  extractRange(node: Node, nodeIndex: number) {
    const firstTextIndex = this.getFirstNonWhitespaceIndex(node.textContent!);
    const lastTextIndex = node.textContent!.length - 1;

    let start = firstTextIndex;
    let end = firstTextIndex + 1;
    let lastRect: DOMRect | undefined

    for (let index = end; index <= lastTextIndex; index++) {
      const currentRect = this.getTextBoundRect(node, index);

      if (!lastRect && this.lastRange) {
        lastRect = this.lastRange.getBoundingClientRect()
        
        if (Math.abs(lastRect.top - currentRect.top) > 10) {
          this.rangesToLine()
        }

        lastRect = currentRect
      }

      if (!lastRect) {
        lastRect = currentRect;
        continue
      }

    
      // 检测是否发生换行
      if (Math.abs(lastRect.top - currentRect.top) > 10) {
        const range = new Range();
        range.setStart(node, start);
        range.setEnd(node, index);
        this.textRanges.push(range);

        start = index;
        lastRect = currentRect;

        this.rangesToLine()

     
      }
    }

    //  处理结尾行
    if (start !== lastTextIndex) {
      const range = new Range();
      range.setStart(node, start);
      range.setEnd(node, lastTextIndex + 1);
      
      this.textRanges.push(range);
      this.lastRange = range
    }
  }
}
