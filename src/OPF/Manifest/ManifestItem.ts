import { XmlElement } from 'xmldoc'

export default class ManifestItem {
  static elementName = 'item'

  fallback?: string
  href: string
  id: string
  mediaOverlay?: string
  mediaType: string
  properties?: string[]

  constructor(id: string, href: string, mediaType: string, fallback?: string) {
    this.id = id
    this.href = href
    this.mediaType = mediaType
    this.fallback = fallback
  }

  static loadFromXMLElement(element: XmlElement): ManifestItem | null {
    const id = element.attr.id
    const href = element.attr.href
    const mediaType = element.attr['media-type']
    const fallback = element.attr.fallback
    let item: ManifestItem | null = null
    if (id && href && mediaType) {
      item = new ManifestItem(id, href, mediaType, fallback)
    }
    const properties = element.attr.properties
    if (properties && item) {
      item.properties = properties?.split(' ')
    }
    if (element.attr['media-overlay'] && item) {
      item.mediaOverlay = element.attr['media-overlay']
    }
    return item
  }

  toXmlString(): string {
    let xmlStr = `<${ManifestItem.elementName} id="${this.id}"`
    if (this.properties) {
      xmlStr += ` properties="${this.properties.toString()}"`
    }
    if (this.fallback) {
      xmlStr += ` fallback="${this.fallback}"`
    }
    xmlStr += ` media-type="${this.mediaType}" href="${this.href}"/>`
    return xmlStr
  }
}
