import Identifier from './Identifier'
import Title from './Title'
import Language from './Language'
import Meta from './Meta'
import Link from './Link'
import { XmlElement } from 'xmldoc'
import Creator from './Creator'
import Contributor from './Contributor'
import Description from './Description'
import Publisher from './Publisher'
import Rights from './Rights'

export default class Metadata {
  static elementName = 'metadata'
  identifiers: Identifier[] // 1 or more
  titles: Title[] // 1 or more
  languages: Language[] // 1 or more
  optional?: [] // 0 or more
  metaList: Meta[] // 1 or more
  linkList: Link[] // 0 or more
  creatorList: Creator[] // 0 or more
  contributorList: Contributor[] // 0 or more
  descriptionList: Description[] // 0 or more
  publisherList: Publisher[] // 0 or more
  rightsList: Rights[] // 0 or more

  constructor(
    identifiers: Identifier[],
    titles: Title[],
    languages: Language[],
    meta: Meta[]
  ) {
    this.identifiers = identifiers
    this.titles = titles
    this.languages = languages
    this.metaList = meta
    this.linkList = []
    this.creatorList = []
    this.contributorList = []
    this.descriptionList = []
    this.publisherList = []
    this.rightsList = []
  }

  static loadFromXMLElement(element: XmlElement): Metadata | null {
    let metadata: Metadata | null = null
    try {
      const titleNodes = element.childrenNamed(Title.elementName)
      const titles: Title[] = []
      for (const node of titleNodes) {
        const title = Title.loadFromXMLElement(node)
        if (title == null) {
          throw Error(
            `Found invalid ${Title.elementName} from ${Metadata.elementName}`
          )
        }
        titles.push(title)
      }
      const identifierNodes = element.childrenNamed(Identifier.elementName)
      const identifiers: Identifier[] = []
      for (const node of identifierNodes) {
        const identifier = Identifier.loadFromXMLElement(node)
        if (identifier == null) {
          throw Error(
            `Found invalid ${Identifier.elementName} from ${Metadata.elementName}`
          )
        }
        identifiers.push(identifier)
      }
      const languageNodes = element.childrenNamed(Language.elementName)
      const languages: Language[] = []
      for (const node of languageNodes) {
        const language = Language.loadFromXMLElement(node)
        if (language == null) {
          throw Error(
            `Found invalid ${Language.elementName} from ${Metadata.elementName}`
          )
        }
        languages.push(language)
      }
      const creatorNodes = element.childrenNamed(Creator.elementName)
      const creators: Creator[] = []
      for (const node of creatorNodes) {
        const creator = Creator.loadFromXMLElement(node)
        if (creator != null) {
          creators.push(creator)
        }
      }
      const contributorNodes = element.childrenNamed(Contributor.elementName)
      const contributors: Contributor[] = []
      for (const node of contributorNodes) {
        const contributor = Contributor.loadFromXMLElement(node)
        if (contributor != null) {
          contributors.push(contributor)
        }
      }
      const publisherNodes = element.childrenNamed(Publisher.elementName)
      const publishers: Publisher[] = []
      for (const node of publisherNodes) {
        const publisher = Publisher.loadFromXMLElement(node)
        if (publisher != null) {
          publishers.push(publisher)
        }
      }
      const rightsNodes = element.childrenNamed(Rights.elementName)
      const rights: Rights[] = []
      for (const node of rightsNodes) {
        const right = Rights.loadFromXMLElement(node)
        if (right != null) {
          rights.push(right)
        }
      }
      const metas: Meta[] = []
      const metaNodes = element.childrenNamed(Meta.elementName)
      for (const node of metaNodes) {
        const meta = Meta.loadFromXMLElement(node)
        if (meta == null) {
          throw Error(
            `Found invalid ${Meta.elementName} from ${Metadata.elementName}`
          )
        }
        metas.push(meta)
      }
      metadata = new Metadata(identifiers, titles, languages, metas)
      metadata.creatorList = creators
      if (contributors.length > 0) {
        metadata.contributorList = contributors
      }
      if (publishers.length > 0) {
        metadata.publisherList = publishers
      }
      if (rights.length > 0) {
        metadata.rightsList = rights
      }

      const linkNodes = element.childrenNamed(Link.elementName)
      for (const node of linkNodes) {
        const link = Link.loadFromXMLElement(node)
        if (link) {
          metadata.linkList.push(link)
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      return metadata
    }
  }

  toXmlString(): string {
    let xmlString = `<${Metadata.elementName}>\n`
    this.identifiers.forEach((item) => {
      xmlString += '\t'
      xmlString += item.toXmlString()
      xmlString += '\n'
    })
    this.titles.forEach((item) => {
      xmlString += '\t'
      xmlString += item.toXmlString()
      xmlString += '\n'
    })
    this.languages.forEach((item) => {
      xmlString += '\t'
      xmlString += item.toXmlString()
      xmlString += '\n'
    })
    this.creatorList.forEach((item) => {
      xmlString += '\t'
      xmlString += item.toXmlString()
      xmlString += '\n'
    })
    this.publisherList.forEach((item) => {
      xmlString += '\t'
      xmlString += item.toXmlString()
      xmlString += '\n'
    })
    this.metaList.forEach((item) => {
      xmlString += '\t'
      xmlString += item.toXmlString()
      xmlString += '\n'
    })
    xmlString += `</${Metadata.elementName}>`
    return xmlString
  }
}
