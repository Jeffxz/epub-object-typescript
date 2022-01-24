import { XmlElement } from 'xmldoc'
import NavLabel from './NavLabel'
import Content from './Content'

export default class PageTarget {
  static elementName = 'pageTarget'

  navLabel: NavLabel
  content?: Content

  constructor(navLabel: NavLabel) {
    this.navLabel = navLabel
  }

  static loadFromXMLElement(element: XmlElement): PageTarget | null {
    const navLabelNode = element.childNamed(NavLabel.elementName)
    if (!navLabelNode) {
      return null
    }
    const navLabel = NavLabel.loadFromXMLElement(navLabelNode)
    if (!navLabel) {
      return null
    }
    const pageTarget = new PageTarget(navLabel)
    const contentNode = element.childNamed(Content.elementName)
    if (contentNode) {
      const content = Content.loadFromXMLElement(contentNode)
      if (content) {
        pageTarget.content = content
      }
    }
    return pageTarget
  }
}
