import BasicElement from './BasicElement'
import { DIR } from '../Types'
import { DC_DESCRIPTION } from '../../constants/DCMI'
import { XmlElement } from 'xmldoc'

export default class Description extends BasicElement {
  static elementName = DC_DESCRIPTION

  dir?: DIR
  xmlLang?: string

  static loadFromXMLElement(element: XmlElement): Description | null {
    const text = element.firstChild?.toString()
    if (text == null) {
      return null
    }
    return new Description(text)
  }

  toXmlString(): string {
    let xmlString = `<${Description.elementName}`
    if (this.id) {
      xmlString += ` id="${this.id}"`
    }
    xmlString += `>${this.contentText}</${Description.elementName}>`
    return xmlString
  }
}
