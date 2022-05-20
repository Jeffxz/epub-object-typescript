import BasicElement from './BasicElement'
import { DIR } from '../Types'
import { DC_CONTRIBUTOR } from '../../constants/DCMI'
import { XmlElement } from 'xmldoc'

export default class Contributor extends BasicElement {
  static elementName = DC_CONTRIBUTOR

  dir?: DIR
  xmlLang?: string

  static loadFromXMLElement(element: XmlElement): Contributor | null {
    const text = element.firstChild?.toString()
    if (text == null) {
      return null
    }
    return new Contributor(text)
  }
}
