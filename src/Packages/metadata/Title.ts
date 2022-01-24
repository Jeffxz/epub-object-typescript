import BasicElement from './BasicElement'
import { DIR } from '../Types'
import { XmlElement } from 'xmldoc'
import { DC_TITLE } from '../constants/DCMI'

export default class Title extends BasicElement {
  static elementName = DC_TITLE
  dir?: DIR
  xmlLang?: string

  static loadFromXMLElement(element: XmlElement): Title | null {
    const text = element.firstChild?.toString()
    if (text == null) {
      return null
    }
    return new Title(text)
  }

  toXmlString(): string {
    let xmlString = `<${Title.elementName}`
    if (this.id) {
      xmlString += ` id="${this.id}"`
    }
    xmlString += `>${this.contentText}</${Title.elementName}>`
    return xmlString
  }
}
