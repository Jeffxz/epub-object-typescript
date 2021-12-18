import BasicElement from './BasicElement'
import { DIR } from '../Types'
import * as XML from "xmldoc";
import {XmlElement} from "xmldoc";

export default class Title extends BasicElement {
  static elementName = 'dc:title'
  dir?: DIR
  xmlLang?: string

  static loadFromXMLElement(element: XmlElement): Title | null {
    const text = element.firstChild?.toString()
    if (text == null) {
      return null
    }
    return new Title(text)
  }
}
