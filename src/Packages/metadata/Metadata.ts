import Identifier from './Identifier'
import Title from './Title'
import Language from './Language'
import Meta from './Meta'
import Link from './Link'
import * as XML from "xmldoc";
import {XmlElement} from "xmldoc";

export default class Metadata {
  static elementName = 'metadata'
  identifiers: Identifier[] // 1 or more
  titles: Title[] // 1 or more
  languages: Language[] // 1 or more
  optional?: [] // 0 or more
  meta: Meta[] // 1 or more
  link?: Link[] // 0 or more

  constructor(
    identifiers: Identifier[],
    titles: Title[],
    languages: Language[],
    meta: Meta[]
  ) {
    this.identifiers = identifiers
    this.titles = titles
    this.languages = languages
    this.meta = meta
  }

  static loadFromXMLElement(element: XmlElement): Metadata | null {
    let metadata: Metadata | null = null
    try {
      const titleNodes = element.childrenNamed(Title.elementName)
      let titles: Title[] = []
      for (let node of titleNodes) {
        const title = Title.loadFromXMLElement(node)
        if (title == null) {
          throw Error(`missing ${Title.elementName} from ${Metadata.elementName}`)
        }
        titles.push(title)
      }
      const identifierNodes = element.childrenNamed(Identifier.elementName)
      let identifiers: Identifier[] = []
      for (let node of identifierNodes) {
        const identifier = Identifier.loadFromXMLElement(node)
        if (identifier == null) {
          throw Error(`missing ${Identifier.elementName} from ${Metadata.elementName}`)
        }
        identifiers.push(identifier)
      }
      const languageNodes = element.childrenNamed(Language.elementName)
      let languages: Language[] = []
      for (let node of languageNodes) {
        const language = Language.loadFromXMLElement(node)
        if (language == null) {
          throw Error(`missing ${Language.elementName} from ${Metadata.elementName}`)
        }
        languages.push(language)
      }
      let metas: Meta[] = []
      metadata = new Metadata(identifiers, titles, languages, metas)
    } catch (error) {
      console.error(error)
    } finally {
      return metadata
    }
  }
}
