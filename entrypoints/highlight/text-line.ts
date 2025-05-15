export class TextLine {
  ranges: Range[];

  constructor(ranges: Range[]) {
    this.ranges = ranges;
  }

  // 将svg字符转为如下格式:
  //  url("data:image/svg+xml,%
  toSvgStr(svg: string) {
    return svg.replace(/\r/g, '')
      .replace(/\n/g, '')
      .replace(/\</g, '%3C')
      .replace(/\>/g, '%3E')
      .replace(/\#/g, '%23')
      .replace(/"/g, "'")
      // 超过一个空格则合并为一个
      .replace(/\s{2,}/g, ' ')

  }

  strToSvg(str: string) {
    return str
      .replace(/"/g, "'")
      .replace(/%/g, "%25")
      .replace(/#/g, "%23")
      .replace(/{/g, "%7B")
      .replace(/}/g, "%7D")
      .replace(/</g, "%3C")
      .replace(/>/g, "%3E")

  }
  generateMaskSvg(ranges: Range[]) {
    const rect = ranges[0].getBoundingClientRect()
    const header = 'data:image/svg+xml'

    const width = window.innerWidth
    const height = window.innerHeight

    const data = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
     <mask id="mask">
      <rect width="100%" height="100%" fill="white"/>
      <rect rx="5" ry="5" x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" fill="black"/>
    </mask>
      <rect x="0" y="0" height="100%" width="100%" fill="black" mask="url(#mask)"/>
    </svg>`

    return `${header},${this.toSvgStr(data)}`
  }

  highlight() {
    const div = document.createElement('div')
    const maskSvg = this.generateMaskSvg(this.ranges)
    div.setAttribute('style',
      [
        'background: rgb(255 255 255 / 30%);',
        'position:fixed;',
        'inset:0;',
        'opacity:0.5;',
        'backdrop-filter: blur(20rem);',
        'z-index:9999;',
        `mask-image: url("${maskSvg}");`,
        'mask-mode: alpha;',
        'mask-repeat: no-report;',
        'pointer-events: none;'

      ].join('')
    )

    document.body.appendChild(div)
    return new Highlight(...this.ranges);
  }
}
