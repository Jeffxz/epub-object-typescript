/* http://idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.4.1 */

import NavMap from './NavMap'
import * as XML from 'xmldoc'
import PageList from './PageList'

export default class Ncx {
  navMap: NavMap
  pageList?: PageList

  constructor(navMap: NavMap) {
    this.navMap = navMap
  }

  static loadFromXML(xmlString: string): Ncx | null {
    const document = new XML.XmlDocument(xmlString)
    const navMapNode = document.childNamed(NavMap.elementName)
    if (navMapNode) {
      const navMap = NavMap.loadFromXMLElement(navMapNode)
      const ncx = new Ncx(navMap)
      const pageListNode = document.childNamed(PageList.elementName)
      if (pageListNode) {
        const pageList = PageList.loadFromXMLElement(pageListNode)
        if (pageList) {
          ncx.pageList = pageList
        }
      }
      return ncx
    }
    return null
  }
}
