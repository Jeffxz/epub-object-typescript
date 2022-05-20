import { XmlElement } from 'xmldoc'

export default class NavLabel {
  static elementName = 'navLabel'

  text: string
  constructor(text: string) {
    this.text = text
  }

  static loadFromXMLElement(element: XmlElement): NavLabel | null {
    const textNode = element.childNamed('text')
    const text = textNode?.val
    if (!text) {
      return null
    }
    return new NavLabel(text)
  }
}
