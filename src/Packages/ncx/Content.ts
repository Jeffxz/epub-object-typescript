import {XmlElement} from "xmldoc";

export default class Content {
  static elementName = 'content'

  src: string

  constructor(src: string) {
    this.src = src
  }

  static loadFromXMLElement(element: XmlElement): Content | null {
    const src = element.attr.src
    if (!src) {
      return null
    }
    return new Content(src)
  }
}
