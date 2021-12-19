import BasicElement from './BasicElement'
import { DIR } from '../Types'
import { XmlElement } from 'xmldoc'

export default class Meta extends BasicElement {
  static elementName = 'meta'

  dir?: DIR
  property: string
  refines?: string
  scheme?: string
  xmlLang?: string

  constructor(property: string, content: string) {
    super(content)
    this.property = property
  }

  static loadFromXMLElement(element: XmlElement): Meta | null {
    let meta: Meta | null = null
    const text = element.firstChild?.toString()
    if (text == null) {
      return meta
    }
    const property = element.attr.property
    meta = new Meta(property, text)
    if (element.attr.refines) {
      meta.refines = element.attr.refines
    }
    return meta
  }
}
