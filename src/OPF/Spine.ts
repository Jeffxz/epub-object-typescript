import { XmlElement } from 'xmldoc'
import { DIR } from './Types'
import { SPINE_PROGRESSION_DIRECTION } from '../constants'

export class Itemref {
  static elementName = 'itemref'

  id?: string
  idref: string
  linear?: string
  properties?: string[]

  constructor(idref: string) {
    this.idref = idref
  }

  static loadFromXMLElement(element: XmlElement): Itemref | null {
    const idref = element.attr.idref
    let item: Itemref | null = null
    if (idref) {
      item = new Itemref(idref)
      if (element.attr.properties) {
        item.properties = element.attr.properties.split(' ')
      }
    }
    return item
  }

  toXmlString(): string {
    return `<${Itemref.elementName} idref="${this.idref}"/>`
  }
}

export default class Spine {
  static elementName = 'spine'

  id?: string
  pageProgressionDirection: DIR
  toc?: string
  pageMap?: string
  items: Itemref[]

  constructor(items: Itemref[]) {
    this.items = items
    this.pageProgressionDirection = DIR.LTR
  }

  static loadFromXMLElement(element: XmlElement): Spine | null {
    let spine: Spine | null = null
    try {
      const itemrefNodes = element.childrenNamed(Itemref.elementName)
      const items: Itemref[] = []
      for (const node of itemrefNodes) {
        const item = Itemref.loadFromXMLElement(node)
        if (item != null) {
          items.push(item)
        }
      }
      spine = new Spine(items)
      const direction = element.attr[SPINE_PROGRESSION_DIRECTION]
      spine.pageProgressionDirection =
        direction && direction == 'rtl' ? DIR.RTL : DIR.LTR
      const toc = element.attr.toc
      if (toc) {
        spine.toc = toc
      }
      const pageMap = element.attr['page-map']
      if (pageMap) {
        spine.pageMap = pageMap
      }
      return spine
    } catch (error) {
      console.error(error)
    }
    return spine
  }

  toXmlString(): string {
    let xmlString = `<${Spine.elementName}`
    if (this.pageProgressionDirection === DIR.RTL) {
      xmlString += ' page-progression-direction="rtl" '
    }
    xmlString += '>\n'
    this.items.forEach((item) => {
      xmlString += '\t'
      xmlString += item.toXmlString()
      xmlString += '\n'
    })
    xmlString += `</${Spine.elementName}>`
    return xmlString
  }
}
