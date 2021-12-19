import BasicElement from './BasicElement'
import { XmlElement } from 'xmldoc'

export default class Language extends BasicElement {
  static elementName = 'dc:language'

  static loadFromXMLElement(element: XmlElement): Language | null {
    const text = element.firstChild?.toString()
    if (text == null) {
      return null
    }
    return new Language(text)
  }
}
