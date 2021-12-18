import { lookup } from 'mime-types'
import * as XML from "xmldoc";
import Title from "./metadata/Title";
import {XmlElement} from "xmldoc";

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

  constructor(id: string, href: string) {
    this.id = id
    this.href = href
    this.mediaType = this.detectMediaType(href)
  }

  setProperties(properties: string[]): void {
    this.properties = properties
  }

  detectMediaType(filePath: string): string {
    const result = lookup(filePath)
    return result ? result : ''
  }

  isCoreMedia(): boolean {
    return CoreMediaTypes.indexOf(this.mediaType) > -1
  }

  static loadFromXMLElement(element: XmlElement): ManifestItem | null {
    const id = element.attr.id
    const href = element.attr.href
    let item: ManifestItem | null = null
    if (id && href) {
      item = new ManifestItem(id, href)
    }
    const properties = element.attr.properties
    if (properties && item) {
      item.setProperties(properties.split(' '))
    }
    return item
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
      let items: ManifestItem[] = []
      for (let node of itemNodes) {
        let item = ManifestItem.loadFromXMLElement(node)
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
}
