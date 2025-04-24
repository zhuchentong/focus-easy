export class TextLine {
  ranges: Range[];

  constructor(ranges: Range[]) {
    this.ranges = ranges;
  }

  highlight() {
    return new Highlight(...this.ranges);
  }
}
