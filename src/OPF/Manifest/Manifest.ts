import { XmlElement } from 'xmldoc'
import ManifestItem from './ManifestItem'

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
