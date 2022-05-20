import { XmlElement } from 'xmldoc'
import PageTarget from './PageTarget'

export default class PageList {
  static elementName = 'pageList'

  pageTargetList: PageTarget[] = []

  static loadFromXMLElement(element: XmlElement): PageList | null {
    const pageTargetNodes = element.childrenNamed(PageTarget.elementName)
    const pageList = new PageList()
    pageTargetNodes.forEach((item) => {
      const pageTarget = PageTarget.loadFromXMLElement(item)
      if (pageTarget) {
        pageList.pageTargetList.push(pageTarget)
      }
    })
    return pageList
  }
}
