import { XmlElement } from 'xmldoc'
import {Itemref} from '../OPF/Spine'
import * as XML from 'xmldoc'
import NavMap from '../NCX/NavMap'

export class Page {
  static elementName = 'page'

  name: string
  href: string

  constructor(name: string, href: string) {
    this.name = name
    this.href = href
  }

  static loadFromXMLElement(element: XmlElement): Page | null {
    const href = element.attr.href
    const name = element.attr.name
    let page: Page | null = null
    if (href && name) {
      page = new Page(name, href)
    }
    return page
  }
}

export class PageMap {
  static elementName = 'page-map'

  static loadFromXML(xmlString: string): Page[] | null {
    const document = new XML.XmlDocument(xmlString)
    const pageList: Page[] = []
    const pageNodes = document.childrenNamed(Page.elementName)
    pageNodes.forEach((item) => {
      const page = Page.loadFromXMLElement(item)
      if (page) {
        pageList.push(page)
      }
    })
    return pageList
  }
}
