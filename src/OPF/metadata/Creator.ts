import BasicElement from './BasicElement'
import { DIR } from '../Types'
import { DC_CREATOR } from '../../constants/DCMI'
import { XmlElement } from 'xmldoc'

export default class Creator extends BasicElement {
  static elementName = DC_CREATOR

  dir?: DIR
  xmlLang?: string

  static loadFromXMLElement(element: XmlElement): Creator | null {
    const text = element.firstChild?.toString()
    if (text == null) {
      return null
    }
    return new Creator(text)
  }
}
