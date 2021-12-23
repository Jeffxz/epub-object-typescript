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
  name?: string
  content?: string

  constructor(property: string, text?: string) {
    super(text)
    this.property = property
  }

  static loadFromXMLElement(element: XmlElement): Meta | null {
    let meta: Meta | null = null
    const text = element.firstChild?.toString()
    const property = element.attr.property
    meta = new Meta(property, text)
    if (element.attr.refines) {
      meta.refines = element.attr.refines
    }
    if (element.attr.name) {
      meta.name = element.attr.name
    }
    if (element.attr.content) {
      meta.content = element.attr.content
    }
    return meta
  }
}
