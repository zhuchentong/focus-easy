/**
 * 网页主要内容区域查找器
 * 通过计算元素面积比例递归查找真实内容容器
 */
export class ContentFinder {
  // 内容区域阈值
  private readonly threshold = 0.5
  // 最大递归深度
  private readonly maxDepth = 100
  
  /**
   * 计算元素区域面积
   * @param element HTML元素
   * @returns 元素面积
   */
  private getElementArea(element: HTMLElement): number {
    if (!element) {
      return 0
    }
    const rect = element.getBoundingClientRect()
    return rect.width * rect.height
  }

  /**
   * 查找当前元素的直接子元素信息
   * @param parent 父元素
   * @returns 子元素信息数组
   */
  public findCurrentChildren(parent: HTMLElement) {
    if (!parent) {
      return []
    }

    const parentArea = this.getElementArea(parent)
    if (parentArea === 0) {
      return []
    }

    const children = Array.from(parent.children) as HTMLElement[]
    
    return children.map(item => ({
      element: item,
      area: this.getElementArea(item),
      ratio: this.getElementArea(item) / parentArea
    }))
  }

  /**
   * 递归查找内容容器
   * @param parent 起始父元素
   * @param depth 当前递归深度
   * @returns 内容容器元素
   */
  public findContentContainer(parent = document.body, depth = 0): HTMLElement {
    if (!parent || depth >= this.maxDepth) {
      return parent
    }

    const children = this.findCurrentChildren(parent)
    const targetElement = children.find(item => 
      item.ratio > this.threshold && item.element.clientHeight > 0
    )

    if (targetElement) {
      return this.findContentContainer(targetElement.element, depth + 1)
    }
    
    return parent
  }
}