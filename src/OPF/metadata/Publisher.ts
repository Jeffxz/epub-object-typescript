import BasicElement from './BasicElement'
import { DIR } from '../Types'
import { DC_PUBLISHER } from '../../constants/DCMI'
import { XmlElement } from 'xmldoc'

export default class Publisher extends BasicElement {
  static elementName = DC_PUBLISHER

  dir?: DIR
  xmlLang?: string

  static loadFromXMLElement(element: XmlElement): Publisher | null {
    const text = element.firstChild?.toString()
    if (text == null) {
      return null
    }
    return new Publisher(text)
  }
}
