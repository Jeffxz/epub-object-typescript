import BasicElement from './BasicElement'
import { DIR } from '../Types'
import { DC_RIGHTS } from '../../constants/DCMI'
import { XmlElement } from 'xmldoc'

export default class Rights extends BasicElement {
  static elementName = DC_RIGHTS

  dir?: DIR
  xmlLang?: string

  static loadFromXMLElement(element: XmlElement): Rights | null {
    const text = element.firstChild?.toString()
    if (text == null) {
      return null
    }
    return new Rights(text)
  }
}
