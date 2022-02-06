import { XmlElement } from 'xmldoc'
import NavLabel from './NavLabel'
import Content from "./Content";

export default class NavPoint {
  static elementName = 'navPoint'

  navLabel: NavLabel
  content: Content | null = null
  navPointList?: NavPoint[]

  constructor(navLabel: NavLabel) {
    this.navLabel = navLabel
  }

  static loadFromXMLElement(element: XmlElement): NavPoint | null {
    const navLabelNodes = element.childrenNamed(NavLabel.elementName)
    if (navLabelNodes) {
      const navLabel = NavLabel.loadFromXMLElement(navLabelNodes[0])
      if (!navLabel) {
        return null
      }
      const navPoint = new NavPoint(navLabel)
      const contentNode = element.childNamed(Content.elementName)
      if (contentNode) {
        const content = Content.loadFromXMLElement(contentNode)
        navPoint.content = content
      }
      const navPointNodes = element.childrenNamed(NavPoint.elementName)
      navPointNodes.forEach((item) => {
        const entity = NavPoint.loadFromXMLElement(item)
        if (entity) {
          if (!navPoint.navPointList) {
            navPoint.navPointList = []
          }
          navPoint.navPointList.push(entity)
        }
      })
      return navPoint
    }
    return null
  }
}
