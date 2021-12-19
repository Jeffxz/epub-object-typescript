import BasicElement from './BasicElement'
import { XmlElement } from 'xmldoc'

export default class Identifier extends BasicElement {
  static elementName = 'dc:identifier'

  constructor(content: string, id?: string) {
    super(content)
    this.id = id
  }

  static loadFromXMLElement(element: XmlElement): Identifier | null {
    const text = element.firstChild?.toString()
    if (text == null) {
      return null
    }
    const id = element.attr.id
    return new Identifier(text, id)
  }
}
