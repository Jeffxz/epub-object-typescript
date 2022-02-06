import { XmlElement } from 'xmldoc'

export default class Link {
  static elementName = 'link'

  href: string
  id?: string
  mediaType?: string
  properties?: string
  refines?: string
  rel: string

  constructor(href: string, rel: string) {
    this.href = href
    this.rel = rel
  }

  static loadFromXMLElement(element: XmlElement): Link | null {
    const href = element.attr.href
    const rel = element.attr.rel
    if (!href || !rel) {
      return null
    }
    return new Link(href, rel)
  }
}
