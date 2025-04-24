import { TextLine } from './text-line';

export class TextScanner {
  textLines: TextLine[] = [];  // 存储扫描得到的文本行对象
  textNodes: Node[] = [];      // 存储扫描到的文本节点
  textRanges: Range[] = [];    // 临时存储当前行的文本范围
  lastRange?: Range;           // 上一个处理的文本范围
  currentTextLine?: TextLine    // 当前正在处理的文本行

  // 扫描指定元素内的文本节点
  scanElement(element: HTMLElement = document.body) {
    const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let currentNode = treeWalker.nextNode();

    // 遍历所有文本节点，过滤掉空白内容
    while (currentNode) {
      if (currentNode.textContent && currentNode.textContent.trim().length !== 0) {
        this.textNodes.push(currentNode);
      }
      currentNode = treeWalker.nextNode();
    }

    this.extractLines();
    return this.textLines;
  }

  // 获取字符串中第一个非空白字符的索引
  getFirstNonWhitespaceIndex(text: string) {
    const match = text.match(/\S/);
    return match ? match.index! : -1;
  }

  // 获取文本节点中指定位置的边界矩形
  getTextBoundRect(node: Node, index: number) {
    const range = new Range();
    range.setStart(node, index);
    range.setEnd(node, index + 1);
    return range.getBoundingClientRect();
  }

  // 从文本节点中提取行信息
  extractLines() {
    this.textLines = [];
    this.textRanges = [];

    // 对每个文本节点提取范围信息
    this.textNodes.forEach((node,index) => this.extractRange(node,index));
    this.rangesToLine()
  }

  // 将当前收集的范围转换为文本行
  rangesToLine() {
    if (!this.textRanges.length) {
      return
    }

    const textLine = new TextLine(this.textRanges)
    this.textLines.push(textLine)

    this.textRanges = []
    this.lastRange = undefined
  }

  // 从单个文本节点中提取范围信息
  extractRange(node: Node, nodeIndex: number) {
    const firstTextIndex = this.getFirstNonWhitespaceIndex(node.textContent!);
    const lastTextIndex = node.textContent!.length - 1;

    let start = firstTextIndex;
    let end = firstTextIndex + 1;
    let lastRect: DOMRect | undefined

    // 遍历文本节点中的每个字符
    for (let index = end; index <= lastTextIndex; index++) {
      const currentRect = this.getTextBoundRect(node, index);

      // 检查是否换行
      if (!lastRect && this.lastRange) {
        lastRect = this.lastRange.getBoundingClientRect()
        
        if (Math.abs(lastRect.top - currentRect.top) > currentRect.height) {
          this.rangesToLine()
        }

        lastRect = currentRect
      }

      if (!lastRect) {
        lastRect = currentRect;
        continue
      }

      // 检测是否发生换行（Y坐标变化超过行高）
      if (Math.abs(lastRect.top - currentRect.top) > currentRect.height) {
        const range = new Range();
        range.setStart(node, start);
        range.setEnd(node, index);
        this.textRanges.push(range);

        start = index;
        lastRect = currentRect;

        this.rangesToLine()
      }
    }

    // 处理节点末尾的文本范围
    if (start !== lastTextIndex) {
      const range = new Range();
      range.setStart(node, start);
      range.setEnd(node, lastTextIndex + 1);
      
      this.textRanges.push(range);
      this.lastRange = range
    }
  }
}
