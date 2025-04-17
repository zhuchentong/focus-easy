export class TextLine {
  node: Node;
  start: number;
  end: number;

  constructor(node: Node, start:number, end: number) {
    this.node = node;
    this.start = start;
    this.end = end;
  }

  highlight() {
    const range = new Range();
    range.setStart(this.node, this.start);
    range.setEnd(this.node, this.end);
    console.log(this)
    return new Highlight(range);
  }
}
