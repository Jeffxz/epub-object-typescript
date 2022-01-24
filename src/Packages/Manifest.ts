import { XmlElement } from 'xmldoc'
import {
  MANIFEST_PROPERTY_COVER_IMAGE,
  MANIFEST_PROPERTY_MATHML,
  MANIFEST_PROPERTY_NAV,
} from './constants/EpubConstants'

export const CoreMediaTypes: string[] = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'audio/mpeg',
  'audio/mp4',
  'text/css',
  'font/ttf',
  'application/font-sfnt',
  'font/otf',
  'application/vnd.ms-opentype',
  'font/woff',
  'application/font-woff',
  'font/woff2',
  'application/xhtml+xml',
  'application/javascript',
  'text/javascript',
  'application/x-dtbncx+xml',
  'application/smil+xml',
  'application/pls+xml',
]

export class ManifestItem {
  static elementName = 'item'

  fallback?: string
  href: string
  id: string
  mediaOverlay?: string
  mediaType: string
  properties?: string[]

  constructor(id: string, href: string, mediaType: string) {
    this.id = id
    this.href = href
    this.mediaType = mediaType
  }

  setProperties(properties: string[]): void {
    this.properties = properties
  }

  isCoreMedia(): boolean {
    return CoreMediaTypes.indexOf(this.mediaType) > -1
  }

  isMathML(): boolean {
    if (this.properties && this.properties.includes(MANIFEST_PROPERTY_MATHML)) {
      return true
    } else {
      return false
    }
  }

  isNav(): boolean {
    if (this.properties && this.properties.includes(MANIFEST_PROPERTY_NAV)) {
      return true
    } else {
      return false
    }
  }

  isCoverImage(): boolean {
    if (
      this.properties &&
      this.properties.includes(MANIFEST_PROPERTY_COVER_IMAGE)
    ) {
      return true
    } else {
      return false
    }
  }

  static loadFromXMLElement(element: XmlElement): ManifestItem | null {
    const id = element.attr.id
    const href = element.attr.href
    const mediaType = element.attr['media-type']
    let item: ManifestItem | null = null
    if (id && href && mediaType) {
      item = new ManifestItem(id, href, mediaType)
    }
    const properties = element.attr.properties
    if (properties && item) {
      item.setProperties(properties.split(' '))
    }
    return item
  }

  toXmlString(): string {
    return `<${ManifestItem.elementName} id="${this.id}" media-type="${this.mediaType}" href="${this.href}"/>`
  }
}

export default class Manifest {
  static elementName = 'manifest'
  id?: string
  items: ManifestItem[] // 1 or more
  nav?: number

  constructor(items: ManifestItem[], id?: string) {
    this.items = items
    if (id) {
      this.id = id
    }
  }

  static loadFromXMLElement(element: XmlElement): Manifest | null {
    try {
      const itemNodes = element.childrenNamed(ManifestItem.elementName)
      const items: ManifestItem[] = []
      for (const node of itemNodes) {
        const item = ManifestItem.loadFromXMLElement(node)
        if (item != null) {
          items.push(item)
        }
      }
      return new Manifest(items)
    } catch (error) {
      console.error(error)
    }
    return null
  }

  toXmlString(): string {
    let xmlString = `<${Manifest.elementName}>\n`
    this.items.forEach((item) => {
      xmlString += '\t'
      xmlString += item.toXmlString()
      xmlString += '\n'
    })
    xmlString += `</${Manifest.elementName}>`
    return xmlString
  }
}
