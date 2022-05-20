import { XmlElement } from 'xmldoc'
import NavPoint from './NavPoint'

export default class NavMap {
  static elementName = 'navMap'

  navPointList: NavPoint[] = []

  static loadFromXMLElement(element: XmlElement): NavMap {
    const navPointNodes = element.childrenNamed(NavPoint.elementName)
    const navMap = new NavMap()
    navPointNodes.forEach((item) => {
      const navPoint = NavPoint.loadFromXMLElement(item)
      if (navPoint) {
        navMap.navPointList.push(navPoint)
      }
    })
    return navMap
  }
}
