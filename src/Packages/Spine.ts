import * as XML from "xmldoc";
import {XmlElement} from "xmldoc";
import {DIR} from "./Types";

export class Itemref {
  static elementName = 'itemref'

  id?: string
  idref: string
  linear?: string
  properties?: [string]

  constructor(idref: string) {
    this.idref = idref
  }

  static loadFromXMLElement(element: XmlElement): Itemref | null {
    const idref = element.attr.idref
    let item: Itemref | null = null
    if (idref) {
      item = new Itemref(idref)
    }
    return item
  }
}

export default class Spine {
  static elementName = 'spine'

  id?: string
  pageProgressionDirection: DIR

  items: Itemref[]

  constructor(items: Itemref[]) {
    this.items = items
    this.pageProgressionDirection = DIR.LTR
  }

  static loadFromXMLElement(element: XmlElement): Spine | null {
    let spine: Spine | null = null
    try {
      const itemrefNodes = element.childrenNamed(Itemref.elementName)
      let items: Itemref[] = []
      for (let node of itemrefNodes) {
        let item = Itemref.loadFromXMLElement(node)
        if (item != null) {
          items.push(item)
        }
      }
      spine = new Spine(items)
      const direction = element.attr['page-progression-direction']
      spine.pageProgressionDirection = direction && direction == 'rtl' ? DIR.RTL : DIR.LTR
      return spine
    } catch (error) {
      console.error(error)
    }
    return spine
  }
}
